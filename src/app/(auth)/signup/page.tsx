'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Shared illustration (identical to LoginPage) ─── */
function TechIllustration() {
  return (
    <svg viewBox="0 0 340 360" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', maxHeight: 320 }}>

      {/* Background blob rings */}
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

      {/* Kanban board surface */}
      <rect x="72" y="108" width="196" height="168" rx="12" fill="white" stroke="#fecaca" strokeWidth="1.5" />
      {/* Board header */}
      <rect x="72" y="108" width="196" height="30" rx="12" fill="#dc2626" />
      <rect x="72" y="126" width="196" height="12" fill="#dc2626" />
      <circle cx="90"  cy="123" r="4.5" fill="white" opacity="0.35" />
      <circle cx="103" cy="123" r="4.5" fill="white" opacity="0.25" />
      <circle cx="116" cy="123" r="4.5" fill="white" opacity="0.15" />
      <rect x="128" y="118" width="64" height="10" rx="3" fill="white" opacity="0.2" />

      {/* Column dividers */}
      <line x1="138" y1="140" x2="138" y2="272" stroke="#fff5f5" strokeWidth="1" />
      <line x1="202" y1="140" x2="202" y2="272" stroke="#fff5f5" strokeWidth="1" />

      {/* Column 1: To Do */}
      <circle cx="88" cy="150" r="4" fill="#94a3b8" />
      <rect x="96" y="146" width="32" height="7" rx="2" fill="#94a3b8" opacity="0.5" />
      <rect x="80" y="162" width="48" height="34" rx="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="86" y="169" width="36" height="5" rx="2" fill="#94a3b8" opacity="0.6" />
      <rect x="86" y="178" width="28" height="4" rx="2" fill="#cbd5e1" opacity="0.7" />
      <rect x="86" y="186" width="16" height="5" rx="2.5" fill="#fef2f2" />
      <rect x="87" y="187" width="14" height="3" rx="1.5" fill="#dc2626" opacity="0.6" />
      <rect x="80" y="200" width="48" height="34" rx="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="86" y="207" width="30" height="5" rx="2" fill="#94a3b8" opacity="0.6" />
      <rect x="86" y="216" width="22" height="4" rx="2" fill="#cbd5e1" opacity="0.7" />
      <rect x="86" y="224" width="16" height="5" rx="2.5" fill="#fef9c3" />
      <rect x="87" y="225" width="14" height="3" rx="1.5" fill="#ca8a04" opacity="0.6" />

      {/* Column 2: In Progress */}
      <circle cx="152" cy="150" r="4" fill="#ef4444" />
      <rect x="160" y="146" width="32" height="7" rx="2" fill="#ef4444" opacity="0.4" />
      <rect x="144" y="162" width="48" height="36" rx="5" fill="white" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="144" y="162" width="4" height="36" rx="2" fill="#ef4444" />
      <rect x="152" y="169" width="32" height="5" rx="2" fill="#dc2626" opacity="0.55" />
      <rect x="152" y="178" width="24" height="4" rx="2" fill="#fca5a5" opacity="0.7" />
      <rect x="152" y="186" width="18" height="5" rx="2.5" fill="#fef2f2" />
      <rect x="153" y="187" width="16" height="3" rx="1.5" fill="#dc2626" opacity="0.7" />
      <rect x="144" y="202" width="48" height="34" rx="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="144" y="202" width="4" height="34" rx="2" fill="#ef4444" opacity="0.4" />
      <rect x="152" y="209" width="36" height="5" rx="2" fill="#94a3b8" opacity="0.55" />
      <rect x="152" y="218" width="20" height="4" rx="2" fill="#cbd5e1" opacity="0.7" />
      <rect x="152" y="226" width="16" height="5" rx="2.5" fill="#fef2f2" />
      <rect x="153" y="227" width="14" height="3" rx="1.5" fill="#dc2626" opacity="0.55" />
      <rect x="144" y="240" width="48" height="28" rx="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="152" y="247" width="28" height="5" rx="2" fill="#94a3b8" opacity="0.55" />
      <rect x="152" y="256" width="18" height="4" rx="2" fill="#cbd5e1" opacity="0.7" />

      {/* Column 3: Done */}
      <circle cx="216" cy="150" r="4" fill="#10b981" />
      <rect x="224" y="146" width="24" height="7" rx="2" fill="#10b981" opacity="0.4" />
      <rect x="208" y="162" width="48" height="34" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
      <rect x="214" y="169" width="28" height="5" rx="2" fill="#6ee7b7" opacity="0.7" />
      <rect x="214" y="178" width="20" height="4" rx="2" fill="#a7f3d0" opacity="0.7" />
      <circle cx="247" cy="183" r="6" fill="#10b981" opacity="0.9" />
      <path d="M244,183 L246,185 L250,181" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="208" y="200" width="48" height="34" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
      <rect x="214" y="207" width="32" height="5" rx="2" fill="#6ee7b7" opacity="0.6" />
      <rect x="214" y="216" width="22" height="4" rx="2" fill="#a7f3d0" opacity="0.65" />
      <circle cx="247" cy="221" r="6" fill="#10b981" opacity="0.75" />
      <path d="M244,221 L246,223 L250,219" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Notification bubble */}
      <g transform="translate(280, 82)">
        <rect x="0" y="0" width="52" height="30" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="0" y="22" width="20" height="8" rx="0" fill="white" />
        <polygon points="6,22 14,22 10,30" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="10" cy="10" r="6" fill="#fee2e2" />
        <rect x="5" y="8" width="1.5" height="5" rx="0.75" fill="#ef4444" />
        <circle cx="5.75" cy="6.5" r="1" fill="#ef4444" />
        <rect x="20" y="7" width="24" height="4" rx="2" fill="#e2e8f0" />
        <rect x="20" y="14" width="16" height="3.5" rx="1.5" fill="#f1f5f9" />
      </g>

      {/* Progress bars widget */}
      <g transform="translate(28, 218)">
        <rect x="0" y="0" width="56" height="48" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="8" y="9" width="24" height="4" rx="2" fill="#e2e8f0" />
        <rect x="8" y="17" width="40" height="6" rx="3" fill="#f1f5f9" />
        <rect x="8" y="17" width="26" height="6" rx="3" fill="#ef4444" opacity="0.75" />
        <rect x="8" y="28" width="40" height="6" rx="3" fill="#f1f5f9" />
        <rect x="8" y="28" width="34" height="6" rx="3" fill="#10b981" opacity="0.6" />
        <rect x="8" y="39" width="40" height="6" rx="3" fill="#f1f5f9" />
        <rect x="8" y="39" width="18" height="6" rx="3" fill="#f59e0b" opacity="0.65" />
      </g>

      {/* Avatar stack */}
      <g transform="translate(24, 96)">
        <rect x="0" y="0" width="60" height="26" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        {[['#f87171',4],['#34d399',14],['#fb7185',24]].map(([c,x],i) => (
          <circle key={i} cx={(x as number)+8} cy={13} r={8} fill={c as string} stroke="white" strokeWidth="1.5" />
        ))}
        <rect x="40" y="9" width="14" height="4" rx="2" fill="#e2e8f0" />
        <rect x="40" y="15" width="10" height="3" rx="1.5" fill="#f1f5f9" />
      </g>

      {/* Sprint bar chart */}
      <g transform="translate(286, 256)">
        <rect x="0" y="0" width="46" height="46" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="6"  y="28" width="6" height="12" rx="2" fill="#fca5a5" />
        <rect x="14" y="22" width="6" height="18" rx="2" fill="#ef4444" />
        <rect x="22" y="18" width="6" height="22" rx="2" fill="#dc2626" />
        <rect x="30" y="24" width="6" height="16" rx="2" fill="#f87171" />
        <rect x="6"  y="10" width="32" height="4" rx="2" fill="#f1f5f9" />
        <rect x="6"  y="10" width="18" height="4" rx="2" fill="#fecaca" />
      </g>

      {/* Floating tag chips */}
      <g transform="translate(64, 70)">
        <rect x="0" y="0" width="44" height="18" rx="9" fill="#fef2f2" />
        <rect x="8" y="6" width="28" height="6" rx="3" fill="#dc2626" opacity="0.5" />
      </g>
      <g transform="translate(230, 62)">
        <rect x="0" y="0" width="52" height="18" rx="9" fill="#fef2f2" />
        <rect x="8" y="6" width="36" height="6" rx="3" fill="#dc2626" opacity="0.45" />
      </g>
      <g transform="translate(36, 162)">
        <rect x="0" y="0" width="40" height="18" rx="9" fill="#dcfce7" />
        <rect x="8" y="6" width="24" height="6" rx="3" fill="#16a34a" opacity="0.45" />
      </g>

      {/* Connector dashed lines */}
      <line x1="108" y1="79" x2="130" y2="115" stroke="#fecaca" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="230" y1="71" x2="210" y2="115" stroke="#fecaca" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
}

/* ─── SignupPage ─── */
export function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (form.password !== form.confirm) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to sign up');
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign up');
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

      {/* Background circles */}
      {[
        { s: 280, t: '-8%',  l: '-6%',  c: '#fecaca' },
        { s: 200, t: '65%',  l: '-4%',  c: '#fecaca' },
        { s: 160, t: '-5%',  r: '2%',   c: '#fecaca' },
        { s: 120, t: '70%',  r: '4%',   c: '#fecaca' },
        { s:  80, t: '40%',  r: '20%',  c: '#fecaca' },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: c.s, height: c.s, background: c.c, opacity: 0.3,
          top: c.t, left: (c as any).l, right: (c as any).r,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Card */}
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
                TaskFlow
              </div>
              <div style={{ fontSize: 10.5, color: '#94a3b8', letterSpacing: '0.03em' }}>
                Project Management
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
              Plan, track &amp; ship — together.
            </p>
          </div>
        </div>

        {/* ── Right: Sign-up form ── */}
        <div style={{
          flex: 1,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 44px',
        }}>

          {/* Heading */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontSize: 26, fontWeight: 700, color: '#1e293b',
              letterSpacing: '-0.03em', margin: '0 0 4px',
            }}>
              Create your account
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Join thousands of teams shipping faster with TaskFlow.
            </p>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#ef4444', fontSize: 13 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

            {/* Username */}
            <div>
              <label style={labelBase}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="e.g. johndoe"
                style={inputBase}
                onFocus={focusIn} onBlur={focusOut}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelBase}>Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="john@company.com"
                style={inputBase}
                onFocus={focusIn} onBlur={focusOut}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelBase}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Min. 8 characters"
                  style={{ ...inputBase, paddingRight: 40 }}
                  onFocus={focusIn} onBlur={focusOut}
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{
                  position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center',
                }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label style={labelBase}>Confirm password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={onChange}
                  placeholder="Re-enter your password"
                  style={{
                    ...inputBase,
                    paddingRight: 40,
                    borderColor: form.confirm && form.confirm !== form.password ? '#f97316' : '#e2e8f0',
                    boxShadow: form.confirm && form.confirm !== form.password
                      ? '0 0 0 3px rgba(249,115,22,0.2)'
                      : 'none',
                  }}
                  onFocus={focusIn}
                  onBlur={e => {
                    if (form.confirm && form.confirm !== form.password) {
                      e.target.style.borderColor = '#fca5a5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)';
                    } else {
                      focusOut(e);
                    }
                  }}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                  position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center',
                }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: 11, color: '#f97316', margin: '4px 0 0', letterSpacing: '0.01em' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer', marginTop: 2 }}>
              <input type="checkbox" required style={{ marginTop: 1, accentColor: '#dc2626', cursor: 'pointer' }} />
              <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                I agree to the{' '}
                <a href="#" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!!(form.confirm && form.confirm !== form.password) || isLoading}
              style={{
                marginTop: 4,
                width: '100%', padding: '11px',
                borderRadius: 9, border: 'none',
                background: '#dc2626', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer',
                letterSpacing: '0.01em',
                transition: 'background 0.18s, transform 0.15s, box-shadow 0.18s',
                boxShadow: '0 2px 12px rgba(220,38,38,0.3)',
                opacity: (form.confirm && form.confirm !== form.password) || isLoading ? 0.7 : 1,
              }}
              onMouseEnter={e => {
                if ((form.confirm && form.confirm !== form.password) || isLoading) return;
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Sign in link */}
            <p style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', margin: '2px 0 0' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#b91c1c')}
                onMouseLeave={e => (e.currentTarget.style.color = '#dc2626')}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;