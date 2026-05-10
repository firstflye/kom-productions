import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { FaArrowLeft } from "react-icons/fa";

export const PostPage = () => {
  const { id } = useParams();

  const { data: post, isLoading } =
    useQuery({
      queryKey: ["post", id],

      queryFn: async () => {
        const { data, error } =
          await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return data;
      },
    });

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading post...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-28">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-400 mb-8"
        >
          <FaArrowLeft />
          Back
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          {post?.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-[450px] object-cover"
            />
          )}

          <div className="p-10">
            <h1 className="text-5xl font-black text-white mb-6">
              {post?.title}
            </h1>

            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {post?.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};