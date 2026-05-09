import { Link } from "react-router";
import { PostList } from "../components/PostList";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome to Kom Productions
          </h1>
          <p className="text-gray-400">
            A space celebrating African values, togetherness, and community stories. Share your wisdom, connect with your community, and build bridges across cultures.
          </p>
        </div>
        {user && (
          <Link
            to="/create"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Share Your Story
          </Link>
        )}
      </div>
      <PostList />
    </div>
  );
};