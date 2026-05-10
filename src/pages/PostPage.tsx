import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Post } from '../components/PostCard'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  parent_comment_id: string | null
  username?: string
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: post, isLoading: postLoading } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_posts_with_counts')
      return data?.find((p: Post) => p.id === id) as Post
    },
    enabled: !!id,
  })

  const { data: comments, refetch: refetchComments } = useQuery<Comment[]>({
    queryKey: ['comments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, user:user_id(raw_user_meta_data)')
        .eq('post_id', id)
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((c: any) => ({
        ...c,
        username: c.user?.raw_user_meta_data?.username ?? 'artist',
      }))
    },
    enabled: !!id,
  })

  async function submitComment() {
    if (!comment.trim() || !user) return
    setSubmitting(true)
    await supabase.from('comments').insert({
      post_id: id,
      content: comment.trim(),
      user_id: user.id,
      parent_comment_id: null,
    })
    setComment('')
    setSubmitting(false)
    refetchComments()
  }

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  if (postLoading) return (
    <div style={{ maxWidth: 900, margin: '60px auto', padding: '0 24px', color: 'var(--text-muted)' }}>
      Loading…
    </div>
  )

  if (!post) return (
    <div style={{ maxWidth: 900, margin: '60px auto', padding: '0 24px' }}>
      <p style={{ color: 'var(--text-muted)' }}>Post not found. <Link to="/" style={{ color: 'var(--lime)' }}>Go home</Link></p>
    </div>
  )

  const communityColor =
    post.community_name?.toLowerCase() === 'ruthless' ? 'var(--ruthless)' :
    post.community_name?.toLowerCase() === 'trace'    ? 'var(--trace)' :
    'var(--lime)'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 120px' }}>
      {/* Back */}
      <Link to="/" className="btn-primary" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 40,
        padding: '10px 20px',
        fontSize: 14,
      }}>
        ← Back to feed
      </Link>

      {/* Post */}
      <article style={{
        background: '#F3F3F3',
        border: '3px solid var(--black)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: 48,
      }}>
        <div style={{ height: 6, background: communityColor }} />
        <div style={{ padding: '48px' }}>
          {post.community_name && (
            <Link
              to={`/community/${post.community_name.toLowerCase()}`}
              className="pill"
              style={{ background: communityColor, color: 'var(--black)', marginBottom: 20, display: 'inline-block' }}
            >
              {post.community_name}
            </Link>
          )}
          <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>{post.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
            by <strong>@{post.username ?? 'artist'}</strong> · {timeAgo(post.created_at)}
          </p>
          {post.image_url && (
            <img src={post.image_url} alt={post.title}
              style={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--black)', marginBottom: 32 }} />
          )}
          <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </p>

          <div style={{
            display: 'flex',
            gap: 32,
            marginTop: 40,
            paddingTop: 32,
            borderTop: '2px solid var(--black)',
            fontSize: 15,
            fontWeight: 600,
          }}>
            <span style={{ color: 'var(--lime)' }}>▲ {post.upvote_count} upvotes</span>
            <span style={{ color: 'var(--ruthless)' }}>▼ {post.downvote_count} downvotes</span>
            <span style={{ color: 'var(--text-muted)' }}>💬 {post.comment_count} comments</span>
          </div>
        </div>
      </article>

      {/* Comments */}
      <section>
        <h2 className="section-heading" style={{ marginBottom: 32 }}>
          Comments
        </h2>

        {/* Write comment */}
        {user ? (
          <div style={{
            background: '#F3F3F3',
            border: '2px solid var(--black)',
            borderRadius: 'var(--radius-md)',
            padding: 32,
            marginBottom: 32,
          }}>
            <textarea
              placeholder="Share your thoughts…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                background: 'var(--white)',
                border: '2px solid var(--black)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontSize: 15,
                resize: 'vertical',
                outline: 'none',
                marginBottom: 16,
                lineHeight: 1.6,
              }}
              onFocus={e => (e.target.style.borderColor = communityColor)}
              onBlur={e  => (e.target.style.borderColor = 'var(--black)')}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={submitComment}
                disabled={submitting || !comment.trim()}
                className="btn-lime"
                style={{
                  padding: '12px 28px',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? 'Posting…' : 'Comment'}
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}>
            <Link to="/auth" style={{ color: communityColor, fontWeight: 600 }}>Sign in</Link> to leave a comment.
          </p>
        )}

        {/* Comment list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments?.filter(c => !c.parent_comment_id).map(c => (
            <div key={c.id} style={{
              background: '#F3F3F3',
              border: '2px solid var(--black)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: communityColor,
                  border: '2px solid var(--black)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--black)', flexShrink: 0,
                }}>
                  {(c.username ?? 'A')[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>@{c.username}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{timeAgo(c.created_at)}</span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.7 }}>{c.content}</p>

              {/* Nested replies */}
              {comments.filter(r => r.parent_comment_id === c.id).map(r => (
                <div key={r.id} style={{
                  marginTop: 16,
                  marginLeft: 32,
                  paddingLeft: 20,
                  borderLeft: `3px solid ${communityColor}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>@{r.username}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{timeAgo(r.created_at)}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{r.content}</p>
                </div>
              ))}
            </div>
          ))}

          {comments?.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 16, textAlign: 'center', padding: '40px 0' }}>
              No comments yet. Start the conversation.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}