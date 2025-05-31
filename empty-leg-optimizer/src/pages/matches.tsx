import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { calculateDistance } from "@/lib/geo";

type Aircraft = {
  id: string;
  tail_number: string;
  current_icao: string;
  next_leg_icao: string;
};

type Airport = {
  icao: string;
  lat: number;
  lon: number;
};

export default function MatchesPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: aircraftData, error: aircraftError } = await supabase
        .from("aircraft")
        .select("id, tail_number, current_icao, next_leg_icao");

      if (aircraftError) {
        console.error("Error fetching aircraft:", aircraftError.message);
      }

      const { data: airportData, error: airportError } = await supabase
        .from("airports")
        .select("icao, lat, lon");

      if (airportError) {
        console.error("Error fetching airports:", airportError.message);
      }

      setAircraft(aircraftData || []);
      setAirports(airportData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-6">Empty Leg Route Matches</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full table-auto bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Tail #</th>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Distance (km)</th>
              <th className="p-2">Suggestions</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((ac) => {
              const from = airports.find((ap) => ap.icao === ac.current_icao);
              const to = airports.find((ap) => ap.icao === ac.next_leg_icao);

              if (!from || !to) return null;
              // Midpoint latitude and longitude
              const midLat = (from.lat + to.lat) / 2;
              const midLon = (from.lon + to.lon) / 2;

              const distance = calculateDistance(
                from.lat,
                from.lon,
                to.lat,
                to.lon
              );
              const detourAirports = airports.filter((airport) => {
                const d = calculateDistance(
                  midLat,
                  midLon,
                  airport.lat,
                  airport.lon
                );
                return d < 300;
              });


              return (
                <tr key={ac.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{ac.tail_number}</td>
                  <td className="p-2">{ac.current_icao}</td>
                  <td className="p-2">{ac.next_leg_icao}</td>
                  <td className="p-2">{distance.toFixed(1)}</td>
                  <td className="p-2 text-sm text-gray-700">
                    {detourAirports.length === 0
                      ? "—"
                      : detourAirports.map((ap) => ap.icao).join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
