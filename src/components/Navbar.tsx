import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const username = user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? 'You'

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path)

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--white)',
      borderBottom: '2px solid var(--black)',
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 60px',
        height: 80,
        display: 'flex',
        alignItems: 'center',
        gap: 48,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'var(--black)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--lime)',
          }}>
            K
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            KOM
          </span>
        </Link>

        {/* Center nav */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flex: 1 }}>
          <NavLink to="/" label="Feed" active={isActive('/') && location.pathname === '/'} />
          <NavLink to="/community/ruthless" label="Ruthless" active={isActive('/community/ruthless')} color="var(--ruthless)" />
          <NavLink to="/community/trace" label="Trace" active={isActive('/community/trace')} color="var(--trace)" />
        </div>

        {/* Right: auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <Link
                to={`/profile/${username}`}
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                @{username}
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  background: 'transparent',
                  border: '2px solid var(--black)',
                  color: 'var(--text-primary)',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'var(--font-primary)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.background = 'var(--black)'
                  ;(e.target as HTMLButtonElement).style.color = 'var(--white)'
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.background = 'transparent'
                  ;(e.target as HTMLButtonElement).style.color = 'var(--text-primary)'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="btn-lime"
              style={{
                padding: '12px 28px',
                fontSize: 15,
              }}
            >
              Join Now
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, label, active, color }: { to: string; label: string; active: boolean; color?: string }) {
  return (
    <Link
      to={to}
      style={{
        color: active ? (color ?? 'var(--black)') : 'var(--text-muted)',
        fontWeight: active ? 700 : 500,
        fontSize: 16,
        textDecoration: 'none',
        transition: 'color 0.2s',
        position: 'relative',
        paddingBottom: 4,
      }}
    >
      {label}
      {active && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: color ?? 'var(--lime)',
          borderRadius: '2px 2px 0 0',
        }} />
      )}
    </Link>
  )
}