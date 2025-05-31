import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
      <h1 className="text-3xl font-bold mb-10 text-black">
        Welcome to the Empty Leg Optimizer
      </h1>
      <div className="space-y-4">
        <Link
          href="/add"
          className="block w-60 bg-blue-600 text-white py-3 rounded-lg text-lg shadow hover:bg-blue-700 transition"
        >
          ➕ Add Aircraft
        </Link>
        <Link
          href="/matches"
          className="block w-60 bg-green-600 text-white py-3 rounded-lg text-lg shadow hover:bg-green-700 transition"
        >
          📋 View Aircraft
        </Link>
      </div>
    </div>
  );
}
