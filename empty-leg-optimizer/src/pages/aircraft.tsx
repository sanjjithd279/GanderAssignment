import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

//aircraft type declaration
type Aircraft = {
  id: string;
  tail_number: string;
  model: string;
  current_icao: string;
  next_leg_icao: string;
  next_leg_time: string;
};

//react component
export default function AircraftList() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]); //hold all aircrafts in array
  const [loading, setLoading] = useState(true); //used to check if page needs to load aircrafts

  useEffect(() => {
    //use effect runs when page loads
    const fetchAircraft = async () => {
      //grabs aircraft from supabase db
      const { data, error } = await supabase
        .from("aircraft")
        .select("*")
        .order("tail_number");

      if (error) {
        console.log("Error fetching aircraft:", error.message);
      } else {
        setAircraft(data); //updates the aircraft array in the react component
      }
      setLoading(false); //set load state off
    };

    fetchAircraft(); //fetch at load
  }, []);

  //return this template that gets rendered
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Aircraft List</h1>
      {loading ? (
        <p>Loading aircraft...</p>
      ) : (
        <table className="w-full table-auto bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Tail #</th>
              <th className="p-2">Model</th>
              <th className="p-2">Current ICAO</th>
              <th className="p-2">Next ICAO</th>
              <th className="p-2">Next Leg Time</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((ac) => (
              <tr key={ac.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{ac.tail_number}</td>
                <td className="p-2">{ac.model}</td>
                <td className="p-2">{ac.current_icao}</td>
                <td className="p-2">{ac.next_leg_icao}</td>
                <td className="p-2">
                  {new Date(ac.next_leg_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
