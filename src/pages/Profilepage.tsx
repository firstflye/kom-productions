import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PostCard, { Post } from '../components/PostCard'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()
  const isOwn = user?.user_metadata?.username === username

  const { data: posts, isLoading, refetch } = useQuery<Post[]>({
    queryKey: ['profile-posts', username],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_posts_with_counts')
      if (error) throw error
      return (data ?? []).filter((p: Post) => p.username === username) as Post[]
    },
    enabled: !!username,
  })

  const initials = (username ?? 'A')[0].toUpperCase()

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 120px' }}>
      {/* Profile header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        marginBottom: 60,
        padding: '48px 48px',
        background: 'var(--lime)',
        border: '3px solid var(--black)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'var(--black)',
          border: '3px solid var(--black)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 42, fontWeight: 700, color: 'var(--lime)', flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
            @{username}
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-primary)' }}>
            {posts?.length ?? 0} post{posts?.length !== 1 ? 's' : ''} · KOM Artist
          </p>
        </div>
        {isOwn && (
          <div className="pill pill-ruthless" style={{ fontSize: 14 }}>
            Your Profile
          </div>
        )}
      </div>

      {/* Posts */}
      <h2 className="section-heading" style={{ marginBottom: 32 }}>
        Posts by @{username}
      </h2>

      {isLoading && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}

      {!isLoading && posts?.length === 0 && (
        <div className="card-gray" style={{
          textAlign: 'center',
          padding: '80px 40px',
          border: '2px dashed var(--black)',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎤</div>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 16 }}>
            {isOwn ? 'You haven\'t posted yet.' : `${username} hasn't posted yet.`}
          </p>
          {isOwn && (
            <Link to="/" className="btn-lime" style={{ marginTop: 16 }}>
              Share Your First Post →
            </Link>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gap: 20 }}>
        {posts?.map(post => (
          <PostCard key={post.id} post={post} onVoteChange={() => refetch()} />
        ))}
      </div>
    </div>
  )
}