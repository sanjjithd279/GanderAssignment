import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Empty Leg Optimizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimize your aircraft routes and find potential detour
            opportunities to maximize efficiency and reduce empty leg flights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Link
            href="/add"
            className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">✈️</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
              Add Aircraft
            </h2>
            <p className="text-gray-600">
              Register new aircraft and their routes to start optimizing your
              flight paths.
            </p>
          </Link>

          <Link
            href="/matches"
            className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
              View Routes
            </h2>
            <p className="text-gray-600">
              Explore current routes and discover potential detour opportunities
              to optimize your flights.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
