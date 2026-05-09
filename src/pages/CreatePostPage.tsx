import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

export const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState("");

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from('posts')
          .upload(fileName, image);

        if (error) throw error;
        imageUrl = supabase.storage.from('posts').getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase
        .from('posts')
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  if (!user) {
    return <div className="text-center py-8">Please sign in to create a post.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Share Your Story
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(24,27,32,0.8)] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-[rgba(24,27,32,0.8)] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 bg-[rgba(24,27,32,0.8)] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Community (optional)</label>
          <input
            type="number"
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            placeholder="Community ID"
            className="w-full px-4 py-3 bg-[rgba(24,27,32,0.8)] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={createPostMutation.isPending}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
        >
          {createPostMutation.isPending ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};