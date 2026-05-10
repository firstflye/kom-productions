import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import {
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";

export const CommunityPage = () => {
  const { id } = useParams();

  const { data: community } = useQuery({
    queryKey: ["community", id],
    queryFn: async () => {
      const { data, error } =
        await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

      if (error) throw error;

      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["community-posts", id],
    queryFn: async () => {
      const { data, error } =
        await supabase
          .from("posts")
          .select("*")
          .eq("community_id", id)
          .order("created_at", {
            ascending: false,
          });

      if (error) throw error;

      return data;
    },
  });

  return (
    <div className="min-h-screen px-4 py-28">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/communities"
          className="inline-flex items-center gap-2 text-purple-400 mb-8"
        >
          <FaArrowLeft />
          Back to Communities
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl mb-6">
            <FaUsers />
          </div>

          <h1 className="text-5xl font-black text-white mb-4">
            {community?.name}
          </h1>

          <p className="text-gray-400 text-lg">
            {community?.description}
          </p>
        </div>

        <div className="space-y-6">
          {posts?.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-purple-500/40 transition-all"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-72 object-cover rounded-2xl mb-5"
                />
              )}

              <h2 className="text-2xl font-bold text-white mb-3">
                {post.title}
              </h2>

              <p className="text-gray-400 line-clamp-3">
                {post.content}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};