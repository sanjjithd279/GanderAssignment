import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

type Airport = {
  icao: string;
  name: string;
};

export default function AddAircraftPage() {
  const router = useRouter();

  const [tailNumber, setTailNumber] = useState("");
  const [currentIcao, setCurrentIcao] = useState("");
  const [nextLegIcao, setNextLegIcao] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirports = async () => {
      const { data, error } = await supabase
        .from("airports")
        .select("icao, name")
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-gradient-x">
              Add New Aircraft
            </h1>
            <p className="text-indigo-200 text-lg font-medium tracking-wide">
              Create a new empty leg route for optimization
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-400/40 hover:scale-105 active:scale-95"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            <span className="group-hover:text-emerald-200 transition-colors duration-300">
              Back to Home
            </span>
          </button>
        </div>

        {loading ? (
          <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-2xl shadow-xl text-center border border-indigo-500/20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div>
            <p className="mt-6 text-indigo-200 text-lg animate-pulse">
              Loading airports database...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-xl space-y-8 max-w-2xl mx-auto border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300"
          >
            <div className="space-y-6">
              <div
                className={`bg-slate-700/50 p-6 rounded-xl border transition-all duration-300 ${
                  focusedField === "tailNumber"
                    ? "border-emerald-400/40 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                    : "border-indigo-500/20 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/5"
                }`}
              >
                <label className="block text-sm font-semibold text-indigo-200 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Tail Number
                </label>
                <input
                  value={tailNumber}
                  onChange={(e) => setTailNumber(e.target.value.toUpperCase())}
                  onFocus={() => setFocusedField("tailNumber")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full border rounded-xl px-5 py-3 transition-all duration-200 text-white placeholder-indigo-200/50 bg-slate-800/50 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-emerald-500/10 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="e.g., N12345"
                  required
                />
              </div>

              <div
                className={`bg-slate-700/50 p-6 rounded-xl border transition-all duration-300 ${
                  focusedField === "currentIcao"
                    ? "border-violet-400/40 shadow-lg shadow-violet-500/10 scale-[1.02]"
                    : "border-indigo-500/20 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/5"
                }`}
              >
                <label className="block text-sm font-semibold text-indigo-200 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  Start Airport (ICAO)
                </label>
                <select
                  value={currentIcao}
                  onChange={(e) => setCurrentIcao(e.target.value)}
                  onFocus={() => setFocusedField("currentIcao")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full border rounded-xl px-5 py-3 transition-all duration-200 text-white bg-slate-800/50 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-violet-500/10 focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                  required
                >
                  <option value="" className="text-indigo-200/50">
                    Select Airport
                  </option>
                  {airports.map((ap) => (
                    <option
                      key={ap.icao}
                      value={ap.icao}
                      className="text-white"
                    >
                      {ap.icao} ({ap.name})
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`bg-slate-700/50 p-6 rounded-xl border transition-all duration-300 ${
                  focusedField === "nextLegIcao"
                    ? "border-purple-400/40 shadow-lg shadow-purple-500/10 scale-[1.02]"
                    : "border-indigo-500/20 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/5"
                }`}
              >
                <label className="block text-sm font-semibold text-indigo-200 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  End Airport (ICAO)
                </label>
                <select
                  value={nextLegIcao}
                  onChange={(e) => setNextLegIcao(e.target.value)}
                  onFocus={() => setFocusedField("nextLegIcao")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full border rounded-xl px-5 py-3 transition-all duration-200 text-white bg-slate-800/50 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-purple-500/10 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  required
                >
                  <option value="" className="text-indigo-200/50">
                    Select Airport
                  </option>
                  {airports.map((ap) => (
                    <option
                      key={ap.icao}
                      value={ap.icao}
                      className="text-white"
                    >
                      {ap.icao} ({ap.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] ${
                submitting
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:from-violet-600 hover:via-purple-600 hover:to-violet-600"
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-violet-400/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              {submitting ? (
                <span className="flex items-center justify-center gap-3 relative">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding Aircraft...
                </span>
              ) : (
                <span className="relative flex items-center justify-center gap-2">
                  <span>Add Aircraft</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
