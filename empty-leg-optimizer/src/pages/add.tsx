import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

type Airport = {
  icao: string;
};

export default function AddAircraftPage() {
  const router = useRouter();

  const [tailNumber, setTailNumber] = useState("");
  const [currentIcao, setCurrentIcao] = useState("");
  const [nextLegIcao, setNextLegIcao] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirports = async () => {
      const { data, error } = await supabase
        .from("airports")
        .select("icao")
        .order("icao");

      if (error) {
        console.error("Error fetching airports:", error.message);
      } else {
        setAirports(data || []);
      }
      setLoading(false);
    };

    fetchAirports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tailNumber || !currentIcao || !nextLegIcao) return;

    const { error } = await supabase.from("aircraft").insert([
      {
        tail_number: tailNumber,
        current_icao: currentIcao,
        next_leg_icao: nextLegIcao,
      },
    ]);

    if (error) {
      console.error("Failed to add aircraft:", error.message);
    } else {
      router.push("/matches");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-6">Add New Aircraft</h1>

      <div className="mb-4">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          ← Back to Home
        </button>
      </div>

      {loading ? (
        <p>Loading airports...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4 max-w-md mx-auto"
        >
          <div>
            <label className="block mb-1 font-medium">Tail Number</label>
            <input
              value={tailNumber}
              onChange={(e) => setTailNumber(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Start Airport (ICAO)
            </label>
            <select
              value={currentIcao}
              onChange={(e) => setCurrentIcao(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Airport</option>
              {airports.map((ap) => (
                <option key={ap.icao} value={ap.icao}>
                  {ap.icao}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">End Airport (ICAO)</label>
            <select
              value={nextLegIcao}
              onChange={(e) => setNextLegIcao(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Airport</option>
              {airports.map((ap) => (
                <option key={ap.icao} value={ap.icao}>
                  {ap.icao}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
