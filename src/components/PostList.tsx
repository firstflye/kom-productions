import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

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

export const PostList = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_posts_with_counts")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  if (isLoading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-400">Error loading posts</div>;

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};