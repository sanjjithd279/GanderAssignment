import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { calculateDistance } from "@/lib/geo";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

type Aircraft = {
  id: string;
  tail_number: string;
  current_icao: string;
  next_leg_icao: string;
  user_id: string;
};

type Airport = {
  icao: string;
  name: string;
  lat: number;
  lon: number;
};

export default function MatchesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: aircraftData, error: aircraftError } = await supabase
        .from("aircraft")
        .select("id, tail_number, current_icao, next_leg_icao, user_id")
        .eq("user_id", user?.id);

      if (aircraftError) {
        console.error("Error fetching aircraft:", aircraftError.message);
      }

      const { data: airportData, error: airportError } = await supabase
        .from("airports")
        .select("icao, name, lat, lon");

      if (airportError) {
        console.error("Error fetching airports:", airportError.message);
      }

      setAircraft(aircraftData || []);
      setAirports(airportData || []);
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 relative overflow-hidden">
        {/* Enhanced animated background elements */}
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
          <div
            className="absolute top-1/4 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-gradient-x">
                Empty Leg Routes
              </h1>
              <p className="text-indigo-200 text-lg font-medium tracking-wide">
                View current routes and potential detour opportunities
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/add")}
                className="group flex items-center gap-2 bg-violet-500/10 text-violet-300 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-violet-500/20 border border-violet-500/20 hover:border-violet-400/40 hover:scale-105 active:scale-95"
              >
                <span className="text-xl transform group-hover:rotate-90 transition-transform duration-300">
                  +
                </span>
                <span className="group-hover:text-violet-200 transition-colors duration-300">
                  Add New Route
                </span>
              </button>
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
          </div>

          {loading ? (
            <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-2xl shadow-xl text-center border border-indigo-500/20 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div>
              <p className="mt-6 text-indigo-200 text-lg animate-pulse">
                Loading routes...
              </p>
            </div>
          ) : aircraft.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-2xl shadow-xl text-center border border-indigo-500/20 transform hover:scale-[1.02] transition-transform duration-300">
              <p className="text-indigo-200 text-lg mb-6">No routes found</p>
              <button
                onClick={() => router.push("/add")}
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Add Your First Route</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-500/20 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-indigo-500/20">
                      <th className="px-6 py-4 text-left text-sm font-medium text-indigo-200 uppercase tracking-wider">
                        Tail #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-indigo-200 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-indigo-200 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-indigo-200 uppercase tracking-wider">
                        Distance
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-indigo-200 uppercase tracking-wider">
                        Potential Detours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-500/20">
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
                          className="hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            <span className="inline-flex items-center">
                              <span className="w-2 h-2 bg-violet-500 rounded-full mr-2 animate-pulse"></span>
                              {ac.tail_number}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">
                            {ac.current_icao}
                            <span className="text-indigo-300/70 ml-1">
                              ({from.name})
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">
                            {ac.next_leg_icao}
                            <span className="text-indigo-300/70 ml-1">
                              ({to.name})
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">
                            <span
                              className={`inline-flex items-center px-4 py-1.5 rounded-full font-medium ${
                                distance === 0
                                  ? "bg-red-500/10 text-red-300 border border-red-500/20"
                                  : "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                              }`}
                            >
                              {distance.toFixed(1)} km
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-indigo-200">
                            {detourAirports.length === 0 ? (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20 font-medium">
                                No detours found
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {detourAirports.slice(0, 3).map((ap) => (
                                  <span
                                    key={ap.icao}
                                    className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-violet-500/20 text-violet-200 border border-violet-500/30 hover:bg-violet-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/10"
                                  >
                                    {ap.icao}
                                    <span className="ml-1 text-violet-300/80">
                                      ({ap.name})
                                    </span>
                                    <span className="ml-1 text-violet-300/80">
                                      {ap.dist.toFixed(0)}km
                                    </span>
                                  </span>
                                ))}
                                {detourAirports.length > 3 && (
                                  <span className="text-indigo-300/70">
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
    </ProtectedRoute>
  );
}
