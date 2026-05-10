import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import {
  FaImage,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

export const CreatePostPage = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState("");

  const imagePreview = image
    ? URL.createObjectURL(image)
    : null;

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;

      if (image) {
        const fileExt = image.name.split(".").pop();

        const fileName = `${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("posts")
          .upload(fileName, image);

        if (error) throw error;

        imageUrl = supabase.storage
          .from("posts")
          .getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase
        .from("posts")
        .insert({
          title,
          content,
          image_url: imageUrl,
          user_id: user.id,
          community_id: communityId || null,
        });

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      navigate("/");
    },
  });

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    createPostMutation.mutate();
  };



  return (
    <div className="min-h-screen px-4 py-28">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-3">
            Creator Studio
          </p>

          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            Share Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Vision
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Publish artwork, updates, stories,
            announcements, or community content.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />

          <form
            onSubmit={handleSubmit}
            className="relative p-8 space-y-8"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Post Title
              </label>

              <input
                type="text"
                placeholder="Enter a powerful title..."
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Content
              </label>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                rows={8}
                placeholder="Tell your story..."
                className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Cover Image
              </label>

              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer bg-black/20 hover:border-purple-500/50 transition-all overflow-hidden relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <FaImage className="text-5xl mb-4" />

                    <p className="text-lg font-medium">
                      Upload an image
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG, WEBP
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(
                      e.target.files?.[0] || null
                    )
                  }
                  className="hidden"
                />
              </label>
            </div>

            {/* Community */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Community ID
              </label>

              <input
                type="number"
                value={communityId}
                onChange={(e) =>
                  setCommunityId(e.target.value)
                }
                placeholder="Optional"
                className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                createPostMutation.isPending
              }
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 font-semibold text-white disabled:opacity-50"
            >
              {createPostMutation.isPending ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Publish Post
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};