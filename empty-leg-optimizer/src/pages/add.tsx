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
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);
    const { error } = await supabase.from("aircraft").insert([
      {
        tail_number: tailNumber,
        current_icao: currentIcao,
        next_leg_icao: nextLegIcao,
      },
    ]);

    if (error) {
      console.error("Failed to add aircraft:", error.message);
      setSubmitting(false);
    } else {
      router.push("/matches");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Aircraft</h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 hover:bg-gray-50"
          >
            <span>←</span> Back to Home
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading airports...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tail Number
                </label>
                <input
                  value={tailNumber}
                  onChange={(e) => setTailNumber(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., N12345"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Airport (ICAO)
                </label>
                <select
                  value={currentIcao}
                  onChange={(e) => setCurrentIcao(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Airport (ICAO)
                </label>
                <select
                  value={nextLegIcao}
                  onChange={(e) => setNextLegIcao(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition-colors ${
                submitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding Aircraft...
                </span>
              ) : (
                "Add Aircraft"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
