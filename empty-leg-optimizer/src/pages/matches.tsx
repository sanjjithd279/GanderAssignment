import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { calculateDistance } from "@/lib/geo";
import { useRouter } from "next/router";

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
  const router = useRouter();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Empty Leg Routes
            </h1>
            <p className="text-gray-600">
              View current routes and potential detour opportunities
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/add")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              + Add New Route
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading routes...</p>
          </div>
        ) : aircraft.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-gray-600 mb-4">No routes found</p>
            <button
              onClick={() => router.push("/add")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              Add Your First Route
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Tail #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Potential Detours
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {aircraft.map((ac) => {
                    const from = airports.find(
                      (ap) => ap.icao === ac.current_icao
                    );
                    const to = airports.find(
                      (ap) => ap.icao === ac.next_leg_icao
                    );

                    if (!from || !to) return null;

                    const distance = calculateDistance(
                      from.lat,
                      from.lon,
                      to.lat,
                      to.lon
                    );

                    const midLat = (from.lat + to.lat) / 2;
                    const midLon = (from.lon + to.lon) / 2;

                    // Find detour airports near the midpoint (< 300 km)
                    const detourAirports = airports
                      .map((airport) => ({
                        ...airport,
                        dist: calculateDistance(
                          midLat,
                          midLon,
                          airport.lat,
                          airport.lon
                        ),
                      }))
                      .filter(
                        (a) =>
                          a.dist < 300 &&
                          a.icao !== ac.current_icao &&
                          a.icao !== ac.next_leg_icao
                      )
                      .sort((a, b) => a.dist - b.dist);

                    return (
                      <tr
                        key={ac.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ac.tail_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ac.current_icao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ac.next_leg_icao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {distance.toFixed(1)} km
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {detourAirports.length === 0 ? (
                            <span className="text-gray-400">
                              No detours found
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {detourAirports.slice(0, 3).map((ap) => (
                                <span
                                  key={ap.icao}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {ap.icao}
                                  <span className="ml-1 text-blue-600">
                                    ({ap.dist.toFixed(0)}km)
                                  </span>
                                </span>
                              ))}
                              {detourAirports.length > 3 && (
                                <span className="text-gray-500">
                                  +{detourAirports.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
