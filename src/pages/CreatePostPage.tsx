import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Props {
  communityId?: string
  communityName?: string
  onCreated: () => void
  onClose: () => void
}

export default function CreatePost({ communityId, communityName, onCreated, onClose }: Props) {
  const { user } = useAuth()
  const [title, setTitle]     = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('posts').insert({
      title: title.trim(),
      content: content.trim(),
      image_url: imageUrl.trim() || null,
      user_id: user!.id,
      community_id: communityId ?? null,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    onCreated()
    onClose()
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--white)',
    border: '2px solid var(--black)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 18px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-primary)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      backdropFilter: 'blur(4px)',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--white)',
        border: '3px solid var(--black)',
        borderRadius: 'var(--radius-md)',
        padding: 48,
        width: '100%',
        maxWidth: 600,
        boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
          New Post
        </h2>
        {communityName && (
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
            Posting to <span className="pill pill-lime" style={{ marginLeft: 8 }}>{communityName}</span>
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--lime)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--black)')}
          />
          <textarea
            placeholder="Share your work, thoughts, or anything..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            onFocus={e => (e.target.style.borderColor = 'var(--lime)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--black)')}
          />
          <input
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--lime)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--black)')}
          />
          {error && <p style={{ color: 'var(--ruthless)', fontSize: 14, fontWeight: 600 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent', border: '2px solid var(--black)',
                color: 'var(--text-primary)', padding: '12px 28px', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', fontFamily: 'var(--font-primary)', fontSize: 15, fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--black)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--white)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="btn-lime"
              style={{
                padding: '12px 32px',
                fontSize: 15,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}