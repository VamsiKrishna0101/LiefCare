import { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Lief App</Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden sm:inline">
              {user.name} ({user.role})
            </span>

            {/* Manager-only links */}
            {user.role === 'manager' && (
              <>
                <Link
                  to="/manager/dashboard"
                  className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
                >
                  Dashboard
                </Link>
                <Link
                  to="/manager"
                  className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                >
                  Set Location
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 cursor-pointer"
                >
                  Create Worker
                </Link>
              </>
            )}

            {/* Worker-only link */}
            {user.role === 'worker' && (
                <>
                              <Link
                to="/worker"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
              >
                Clock In/Out
              </Link>
            <Link
                to="/registerface"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
              >
                Register Face
              </Link>
                </>

            
            )}

            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
