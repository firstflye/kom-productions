import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from "../supabase-client";
import { useAuth } from '../context/AuthContext'
import PostCard, { Post } from '../components/PostCard'
import CreatePost from './CreatePostPage'

const COMMUNITY_META: Record<string, { color: string; tagline: string; description: string; emoji: string; bg: string }> = {
  ruthless: {
    color: 'var(--ruthless)',
    bg: '#FFE5E5',
    emoji: '🔥',
    tagline: 'Raw. Unfiltered. Ruthless.',
    description: 'A community for artists who don\'t hold back. Painters, rappers, designers, photographers — if your work hits hard, this is home.',
  },
  trace: {
    color: 'var(--trace)',
    bg: '#E5F9FF',
    emoji: '✦',
    tagline: 'Leave your mark.',
    description: 'The underground scene. Electronic producers, digital artists, and creatives who live in the space between sound and silence.',
  },
}

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [showCreate, setShowCreate] = useState(false)
  const meta = COMMUNITY_META[slug ?? ''] ?? { color: 'var(--lime)', tagline: '', description: '', emoji: '★', bg: '#F3F3F3' }

  const { data: community } = useQuery({
    queryKey: ['community', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('communities')
        .select('*')
        .ilike('name', slug ?? '')
        .single()
      return data
    },
    enabled: !!slug,
  })

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['posts', slug],
    queryFn: async (): Promise<Post[]> => {
      const allPosts = await supabase.rpc('get_posts_with_counts')
      if (allPosts.error) throw allPosts.error
      return (allPosts.data ?? []).filter(
        (p: Post) => p.community_name?.toLowerCase() === slug?.toLowerCase()
      ) as Post[]
    },
    enabled: !!slug,
  })

  const handleVote = useCallback(() => refetch(), [refetch])

  return (
    <div>
      {/* Banner */}
      <section style={{
        background: meta.bg,
        padding: '80px 60px 100px',
        borderBottom: '3px solid var(--black)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          border: `4px solid ${meta.color}`,
          borderRadius: '50%',
          opacity: 0.2,
        }} />

        <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>{meta.emoji}</div>
            <h1 style={{
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: 20,
            }}>
              {(slug ?? '').toUpperCase()}
            </h1>
            <p style={{
              fontSize: 20,
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              marginBottom: 16,
              fontWeight: 600,
            }}>
              {meta.tagline}
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 560 }}>
              {meta.description}
            </p>
            {user ? (
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary"
                style={{ padding: '16px 36px' }}
              >
                + Post to {(slug ?? '').charAt(0).toUpperCase() + (slug ?? '').slice(1)}
              </button>
            ) : (
              <Link to="/auth" className="btn-primary" style={{ padding: '16px 36px' }}>
                Join to Post
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feed */}
      <section style={{
        background: 'var(--white)',
        padding: '80px 60px 120px',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h2 className="section-heading">Community Feed</h2>
          </div>

          {isLoading && (
            <div style={{ color: 'var(--text-muted)', padding: 24 }}>Loading posts…</div>
          )}

          {!isLoading && posts?.length === 0 && (
            <div className="card-gray" style={{
              textAlign: 'center',
              padding: '80px 40px',
              border: '2px dashed var(--black)',
            }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{meta.emoji}</div>
              <p style={{ fontSize: 18, color: 'var(--text-muted)' }}>
                No posts here yet. Drop the first one.
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gap: 20 }}>
            {posts?.map(post => (
              <PostCard key={post.id} post={post} onVoteChange={handleVote} />
            ))}
          </div>
        </div>
      </section>

      {showCreate && community && (
        <CreatePost
          communityId={community.id}
          communityName={community.name}
          onCreated={() => refetch()}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  )
}