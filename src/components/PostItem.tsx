import { Link } from "react-router";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
  community_name?: string;
}

interface PostItemProps {
  post: Post;
}

export const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="bg-[rgba(24,27,32,0.8)] border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {post.avatar_url && (
          <img
            src={post.avatar_url}
            alt="Author avatar"
            className="w-10 h-10 rounded-full border border-white/10"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {post.title}
            </h3>
            {post.community_name && (
              <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {post.community_name}
              </span>
            )}
          </div>
          <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post image"
              className="w-full h-48 object-cover rounded-lg mb-4 border border-white/10"
            />
          )}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>👍 {post.like_count || 0}</span>
              <span>💬 {post.comment_count || 0}</span>
            </div>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <Link
            to={`/post/${post.id}`}
            className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};