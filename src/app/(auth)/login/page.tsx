'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Tech / Log Monitoring illustration ─── */
function TechIllustration() {
  return (
    <svg viewBox="0 0 340 360" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', maxHeight: 320 }}>

      {/* ── Background blob rings ── */}
      <ellipse cx="170" cy="195" rx="138" ry="118" fill="#fef2f2" opacity="0.7" />
      <ellipse cx="165" cy="198" rx="100" ry="86"  fill="#fecaca" opacity="0.55" />
      <ellipse cx="168" cy="200" rx="70"  ry="60"  fill="#fca5a5" opacity="0.4" />

      {/* Ambient floating dots */}
      <circle cx="52"  cy="110" r="9"  fill="#fca5a5" opacity="0.55" />
      <circle cx="295" cy="145" r="13" fill="#fecaca" opacity="0.45" />
      <circle cx="38"  cy="270" r="7"  fill="#fca5a5" opacity="0.5"  />
      <circle cx="305" cy="278" r="9"  fill="#fecaca" opacity="0.4"  />
      <circle cx="255" cy="88"  r="6"  fill="#fca5a5" opacity="0.45" />
      <circle cx="78"  cy="310" r="5"  fill="#fecaca" opacity="0.4"  />

      {/* ══ TERMINAL WINDOW ══ */}
      <rect x="50" y="100" width="240" height="150" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      
      {/* Terminal Title Bar */}
      <rect x="50" y="100" width="240" height="24" rx="10" fill="#0f172a" />
      <rect x="50" y="114" width="240" height="10" fill="#0f172a" />
      
      {/* Window Controls */}
      <circle cx="68" cy="112" r="4" fill="#ef4444" />
      <circle cx="82" cy="112" r="4" fill="#eab308" />
      <circle cx="96" cy="112" r="4" fill="#22c55e" />

      {/* Log Lines */}
      {/* Info Log */}
      <rect x="65" y="135" width="40" height="6" rx="3" fill="#3b82f6" opacity="0.8" />
      <rect x="110" y="135" width="120" height="6" rx="3" fill="#94a3b8" opacity="0.4" />
      {/* Error Log */}
      <rect x="65" y="150" width="40" height="6" rx="3" fill="#ef4444" opacity="0.8" />
      <rect x="110" y="150" width="160" height="6" rx="3" fill="#94a3b8" opacity="0.4" />
      {/* Warn Log */}
      <rect x="65" y="165" width="40" height="6" rx="3" fill="#eab308" opacity="0.8" />
      <rect x="110" y="165" width="90" height="6" rx="3" fill="#94a3b8" opacity="0.4" />
      {/* Info Log */}
      <rect x="65" y="180" width="40" height="6" rx="3" fill="#3b82f6" opacity="0.8" />
      <rect x="110" y="180" width="140" height="6" rx="3" fill="#94a3b8" opacity="0.4" />
      {/* Info Log */}
      <rect x="65" y="195" width="40" height="6" rx="3" fill="#3b82f6" opacity="0.8" />
      <rect x="110" y="195" width="100" height="6" rx="3" fill="#94a3b8" opacity="0.4" />

      {/* ══ FLOATING UI ELEMENTS ══ */}

      {/* Floating Chart Widget (top right) */}
      <g transform="translate(240, 70)">
        <rect width="70" height="50" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="8" y="10" width="20" height="4" rx="2" fill="#cbd5e1" />
        <path d="M10 40 L20 25 L35 30 L55 15" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="55" cy="15" r="3" fill="#dc2626" />
        <circle cx="35" cy="30" r="3" fill="#fca5a5" />
      </g>

      {/* Floating Error Rate Widget (bottom left) */}
      <g transform="translate(20, 210)">
        <rect width="80" height="40" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="10" y="10" width="30" height="4" rx="2" fill="#cbd5e1" />
        <rect x="10" y="20" width="60" height="8" rx="4" fill="#fef2f2" />
        <rect x="10" y="20" width="30" height="8" rx="4" fill="#dc2626" />
      </g>

      {/* Floating Alerts Widget (bottom right) */}
      <g transform="translate(260, 200)">
        <rect width="60" height="55" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="30" cy="20" r="10" fill="#fee2e2" />
        <path d="M30 14 v6 m0 3 v1" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <rect x="15" y="40" width="30" height="4" rx="2" fill="#cbd5e1" />
      </g>

      {/* Simple Connection Lines */}
      <line x1="160" y1="80" x2="240" y2="80" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
      <line x1="80" y1="210" x2="80" y2="250" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
    </svg>
  );
}

/* ─── Main LoginPage ─── */
export function SigninPage() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to sign in');
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      router.push('/console');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '10px 13px',
    borderRadius: 9,
    border: '1.5px solid #e2e8f0',
    background: '#f8fafc',
    color: '#1e293b',
    fontSize: 13,
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s, background 0.18s',
    boxSizing: 'border-box',
  };

  const labelBase: React.CSSProperties = {
    display: 'block',
    fontSize: 11.5,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 5,
    letterSpacing: '0.03em',
  };

  const focusIn  = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#ef4444';
    e.target.style.boxShadow  = '0 0 0 3px rgba(239,68,68,0.1)';
    e.target.style.background = '#fff';
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow  = 'none';
    e.target.style.background = '#f8fafc';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle background circles */}
      {[
        { s: 280, t: '-8%',  l: '-6%',  c: '#fecaca' },
        { s: 200, t: '65%',  l: '-4%',  c: '#fecaca' },
        { s: 160, t: '-5%',  r: '2%',   c: '#fecaca' },
        { s: 120, t: '70%',  r: '4%',   c: '#fecaca' },
        { s:  80, t: '40%',  r: '20%',  c: '#fecaca' },
      ].map((c,i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: c.s, height: c.s,
          background: c.c, opacity: 0.3,
          top: c.t, left: (c as any).l, right: (c as any).r,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Card ── */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: 840,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(14,165,233,0.13), 0 4px 16px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Left: Illustration ── */}
        <div style={{
          flex: '0 0 46%',
          background: '#fff5f5',
          clipPath: 'path("M0,0 L370,0 Q400,80 378,210 Q400,330 370,520 L0,520 Z")',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 22px 22px',
          position: 'relative',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: '#dc2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(220,38,38,0.35)',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="3" width="5" height="14" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="8.5" y="3" width="5" height="9" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="15" y="3" width="3" height="11" rx="1.5" fill="white" opacity="0.35"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                LogOps
              </div>
              <div style={{ fontSize: 10.5, color: '#94a3b8', letterSpacing: '0.03em' }}>
                Log Monitoring
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
            <TechIllustration />
          </div>

          {/* Tagline */}
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <p style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.6 }}>
              Real-time observability and incident response.
            </p>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div style={{
          flex: 1,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 44px',
        }}>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontSize: 26, fontWeight: 700, color: '#1e293b',
              letterSpacing: '-0.03em', margin: '0 0 4px',
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Sign in to continue to your workspace.
            </p>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#ef4444', fontSize: 13 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Email */}
            <div>
              <label style={labelBase}>Email address</label>
              <input type="email" name="email" value={form.email} onChange={onChange}
                placeholder="john@company.com" style={inputBase}
                onFocus={focusIn} onBlur={focusOut} required />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ ...labelBase, margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: 11, color: '#ef4444', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#ef4444')}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} name="password"
                  value={form.password} onChange={onChange}
                  placeholder="Min. 8 characters"
                  style={{ ...inputBase, paddingRight: 40 }}
                  onFocus={focusIn} onBlur={focusOut} required />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{
                  position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center',
                }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: 6,
                width: '100%', padding: '11px',
                borderRadius: 9, border: 'none',
                background: '#dc2626', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer',
                letterSpacing: '0.01em',
                transition: 'background 0.18s, transform 0.15s, box-shadow 0.18s',
                boxShadow: '0 2px 12px rgba(220,38,38,0.3)',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={e => {
                if (isLoading) return;
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = '#b91c1c';
                b.style.transform = 'translateY(-1px)';
                b.style.boxShadow = '0 6px 20px rgba(220,38,38,0.38)';
              }}
              onMouseLeave={e => {
                if (isLoading) return;
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = '#dc2626';
                b.style.transform = 'none';
                b.style.boxShadow = '0 2px 12px rgba(220,38,38,0.3)';
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Sign in */}
            <p style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', margin: '4px 0 0' }}>
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#b91c1c')}
                onMouseLeave={e => (e.currentTarget.style.color = '#dc2626')}>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;