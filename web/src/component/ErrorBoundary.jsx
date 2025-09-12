import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();

  const errorMessage = error?.message || 'An unexpected error occurred';
  const errorStatus = error?.status || error?.statusText || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-xl text-gray-700 mb-4">Something went wrong</p>

        {errorStatus && (
          <p className="text-lg text-gray-600 mb-2">Error: {errorStatus}</p>
        )}

        <p className="text-gray-500 mb-8">{errorMessage}</p>

        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;
