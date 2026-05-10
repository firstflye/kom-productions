import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const CreateCommunityPage = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const createCommunityMutation =
    useMutation({
      mutationFn: async () => {
        if (!user) {
          throw new Error(
            "You must be signed in"
          );
        }

        const { error } = await supabase
          .from("communities")
          .insert({
            name,
            description,
            creator_id: user.id,
          });

        if (error) throw error;
      },

      onSuccess: () => {
        toast.success(
          "Community created!"
        );

        navigate("/communities");
      },

      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    createCommunityMutation.mutate();
  };

  return (
    <div className="min-h-screen px-4 py-28">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-3">
            Creator Hub
          </p>

          <h1 className="text-5xl font-black text-white">
            Create Community
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 space-y-6"
        >
          <div>
            <label className="block text-gray-300 mb-3">
              Community Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-3">
              Description
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 text-white resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              createCommunityMutation.isPending
            }
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
          >
            {createCommunityMutation.isPending
              ? "Creating..."
              : "Create Community"}
          </button>
        </form>
      </div>
    </div>
  );
};