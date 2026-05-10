import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
      avatar_url?: string;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();

  return (
    <div className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-lime flex items-center justify-center font-bold text-black mr-3">
          {post.profiles?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {post.profiles?.username || "Anonymous"}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Link to={`/post/${post.id}`} className="block group">
        <h3 className="text-xl font-bold mb-2 group-hover:text-lime transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 line-clamp-3">
          {post.content}
        </p>
      </Link>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <Link 
          to={`/post/${post.id}`} 
          className="text-sm font-medium text-gray-500 hover:text-black"
        >
          View Discussion
        </Link>
        
        {user?.id === post.id && (
           <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-400">
             Your Post
           </span>
        )}
      </div>
    </div>
  );
};

export default PostCard;