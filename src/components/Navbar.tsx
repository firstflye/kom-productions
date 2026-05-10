import { useState } from "react";
import { Link } from "react-router";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    signInWithGitHub,
    signInWithGoogle,
    signOut,
    user,
  } = useAuth();

  const displayName =
    user?.user_metadata.user_name ||
    user?.user_metadata.full_name ||
    user?.email;

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="font-mono text-xl font-bold text-white"
          >
            kom<span className="text-purple-500">-productions</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>

            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Post
            </Link>

            <Link
              to="/communities"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Communities
            </Link>

            <Link
              to="/community/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Community
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  />
                )}

                <span className="text-gray-300 text-sm">
                  {displayName}
                </span>

                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* GitHub Button */}
                <button
                  onClick={signInWithGitHub}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                >
                  <FaGithub className="text-lg" />
                  <span className="text-sm font-medium">
                    GitHub
                  </span>
                </button>

                {/* Google Button */}
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                >
                  <FaGoogle className="text-lg text-red-400" />
                  <span className="text-sm font-medium">
                    Google
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Home
            </Link>

            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Post
            </Link>

            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Communities
            </Link>

            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Community
            </Link>

            {!user ? (
              <div className="flex flex-col gap-3 mt-4 px-3">
                <button
                  onClick={signInWithGitHub}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  <FaGithub />
                  GitHub
                </button>

                <button
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  <FaGoogle className="text-red-400" />
                  Google
                </button>
              </div>
            ) : (
              <div className="px-3 mt-4">
                <button
                  onClick={signOut}
                  className="w-full px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};