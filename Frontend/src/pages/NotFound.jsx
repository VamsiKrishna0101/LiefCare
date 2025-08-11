import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="mb-4">Page not found</p>
      <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">Go Home</Link>
    </div>
  );
}
