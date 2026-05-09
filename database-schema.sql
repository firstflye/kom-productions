-- Database schema for Kom Productions social media app
-- ─────────────────────────────────────────────────────
-- Changes from original:
--   1. All PKs use gen_random_uuid() instead of SERIAL for consistency & non-guessable IDs
--   2. Removed redundant `author TEXT` column from comments (derive from auth.users at query time)
--   3. Added missing UPDATE / DELETE RLS policies for posts and communities (owners only)
--   4. get_posts_with_counts() now returns username + both upvote_count & downvote_count
--      (was misleadingly called like_count and only counted upvotes)
--   5. Added indexes on all foreign-key columns for query performance
--   6. SECURITY DEFINER on RPC function is intentional — documented below

-- ── Communities ───────────────────────────────────────
CREATE TABLE communities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by  UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_communities_created_by ON communities(created_by);

-- ── Posts ─────────────────────────────────────────────
CREATE TABLE posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  image_url    TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_user_id      ON posts(user_id);
CREATE INDEX idx_posts_community_id ON posts(community_id);
CREATE INDEX idx_posts_created_at   ON posts(created_at DESC);

-- ── Comments ──────────────────────────────────────────
-- Removed `author TEXT NOT NULL` — username is fetched via JOIN on auth.users
-- to avoid the name going out of sync when a user changes their display name.
CREATE TABLE comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id           UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id    ON comments(post_id);
CREATE INDEX idx_comments_user_id    ON comments(user_id);
CREATE INDEX idx_comments_parent     ON comments(parent_comment_id);

-- ── Votes ─────────────────────────────────────────────
CREATE TABLE votes (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote    INTEGER NOT NULL CHECK (vote IN (-1, 1)), -- -1 downvote, 1 upvote
  UNIQUE(post_id, user_id)
  -- The UNIQUE constraint above implicitly creates an index on (post_id, user_id)
);

CREATE INDEX idx_votes_user_id ON votes(user_id);

-- ── Row Level Security ────────────────────────────────
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes       ENABLE ROW LEVEL SECURITY;

-- Communities
CREATE POLICY "communities_select"  ON communities FOR SELECT USING (true);
CREATE POLICY "communities_insert"  ON communities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Only the creator can edit or delete their community
CREATE POLICY "communities_update"  ON communities FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "communities_delete"  ON communities FOR DELETE USING (auth.uid() = created_by);

-- Posts
CREATE POLICY "posts_select"  ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert"  ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Only the author can edit or delete their own post
CREATE POLICY "posts_update"  ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts_delete"  ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "comments_select"  ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert"  ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Only the author can edit or delete their own comment
CREATE POLICY "comments_update"  ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete"  ON comments FOR DELETE USING (auth.uid() = user_id);

-- Votes
CREATE POLICY "votes_select"  ON votes FOR SELECT USING (true);
CREATE POLICY "votes_insert"  ON votes FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_update"  ON votes FOR UPDATE  USING     (auth.uid() = user_id);
CREATE POLICY "votes_delete"  ON votes FOR DELETE  USING     (auth.uid() = user_id);

-- ── RPC: get_posts_with_counts() ──────────────────────
-- SECURITY DEFINER is intentional: the function needs to read auth.users
-- (which is not accessible to the anon role under normal RLS) to fetch
-- avatar_url and username. Keep this function minimal — do NOT add any
-- sensitive logic here, as it bypasses row-level security on auth.users.
CREATE OR REPLACE FUNCTION get_posts_with_counts()
RETURNS TABLE (
  id             UUID,
  title          TEXT,
  content        TEXT,
  created_at     TIMESTAMP WITH TIME ZONE,
  image_url      TEXT,
  username       TEXT,   -- added: display name of the post author
  avatar_url     TEXT,
  upvote_count   BIGINT, -- renamed from like_count; was incorrectly named
  downvote_count BIGINT, -- new: expose downvotes separately
  comment_count  BIGINT,
  community_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.content,
    p.created_at,
    p.image_url,
    u.raw_user_meta_data->>'username'   AS username,
    u.raw_user_meta_data->>'avatar_url' AS avatar_url,
    COALESCE(v.upvote_count,   0)       AS upvote_count,
    COALESCE(v.downvote_count, 0)       AS downvote_count,
    COALESCE(c.comment_count,  0)       AS comment_count,
    comm.name                           AS community_name
  FROM posts p
  LEFT JOIN auth.users u   ON p.user_id      = u.id
  LEFT JOIN communities comm ON p.community_id = comm.id
  LEFT JOIN (
    SELECT
      post_id,
      COUNT(*) FILTER (WHERE vote =  1) AS upvote_count,
      COUNT(*) FILTER (WHERE vote = -1) AS downvote_count
    FROM votes
    GROUP BY post_id
  ) v ON p.id = v.post_id
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS comment_count
    FROM comments
    GROUP BY post_id
  ) c ON p.id = c.post_id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;