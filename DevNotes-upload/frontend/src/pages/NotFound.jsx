import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center dark:bg-gray-950">
    <p className="text-7xl font-extrabold text-brand-600">404</p>
    <h1 className="text-2xl font-bold">Page not found</h1>
    <p className="text-gray-500 dark:text-gray-400">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary mt-2">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
