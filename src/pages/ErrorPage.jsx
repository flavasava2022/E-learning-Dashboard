import { useRouteError, useNavigate } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const safeMessage = error?.statusText || "Something went wrong.";
  const details = error?.message && error.statusText !== error.message ? error.message : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-md rounded-xl p-10  text-center md:w-[85%]">
        <h1 className="text-5xl font-extrabold text-red-600 mb-6">Oops!</h1>
        <p className="text-lg text-gray-800 mb-4">
          {safeMessage}
        </p>
        {details && (
          <p className="text-sm text-gray-500 mb-8">{details}</p>
        )}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Try again"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Go Home"
          >
            Go Home
          </button>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          If this keeps happening, please contact support.
        </p>
      </div>
    </div>
  );
}
