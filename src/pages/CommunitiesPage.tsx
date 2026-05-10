import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import {
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

export const CommunitiesPage = () => {
  const { data: communities, isLoading } =
    useQuery({
      queryKey: ["communities"],
      queryFn: async () => {
        const { data, error } =
          await supabase
            .from("communities")
            .select("*")
            .order("created_at", {
              ascending: false,
            });

        if (error) throw error;

        return data;
      },
    });

  return (
    <div className="min-h-screen px-4 py-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-2">
              Explore
            </p>

            <h1 className="text-5xl font-black text-white">
              Communities
            </h1>
          </div>

          <Link
            to="/community/create"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
          >
            Create Community
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400">
            Loading communities...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities?.map((community) => (
              <Link
                key={community.id}
                to={`/community/${community.id}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-purple-500/40 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl text-white mb-5">
                    <FaUsers />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3">
                    {community.name}
                  </h2>

                  <p className="text-gray-400 mb-6 line-clamp-3">
                    {community.description}
                  </p>

                  <div className="flex items-center gap-2 text-purple-400 font-medium">
                    View Community
                    <FaArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};