import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Airport = {
  icao: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
};

export default function AirportList() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirports = async () => {
      const { data, error } = await supabase
        .from("airports")
        .select("*")
        .order("icao");
      if (error) {
        console.log("Error fetching airports", error.message);
      } else {
        setAirports(data);
      }
      setLoading(false);
    };
    fetchAirports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Airport List</h1>
      {loading ? (
        <p>Loading airports...</p>
      ) : (
        <table className="w-full table-auto bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">ICAO</th>
              <th className="p-2">Name</th>
              <th className="p-2">City</th>
              <th className="p-2">Latitude</th>
              <th className="p-2">Longitude</th>
            </tr>
          </thead>
          <tbody>
            {airports.map((airport) => (
              <tr key={airport.icao} className="border-t hover:bg-gray-50">
                <td className="p-2">{airport.icao}</td>
                <td className="p-2">{airport.name}</td>
                <td className="p-2">{airport.city}</td>
                <td className="p-2">{airport.lat.toFixed(4)}</td>
                <td className="p-2">{airport.lon.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
