'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { C } from '@/lib/theme';
import { labelStyle } from '@/components/Shell';
import { Button } from '@/components/ui/button';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [registeredDomain, setRegisteredDomain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { company_name: companyName, registered_domain: registeredDomain },
          },
        });
        if (error) throw error;
        // If email confirmation is on, there is no session yet.
        if (!data.session) {
          setNotice('Account created. Check your email to confirm, then log in.');
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <label style={labelStyle} htmlFor="email">Email</label>
        <input id="email" className="hw-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="password">Password</label>
        <input id="password" className="hw-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
      </div>
      {mode === 'signup' && (
        <>
          <div>
            <label style={labelStyle} htmlFor="company">Company name</label>
            <input id="company" className="hw-input" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle} htmlFor="domain">Registered domain</label>
            <input id="domain" className="hw-input" type="text" placeholder="example.com" value={registeredDomain} onChange={(e) => setRegisteredDomain(e.target.value)} />
          </div>
        </>
      )}

      {error && <p style={{ color: C.high, fontSize: '14px', margin: '0' }}>{error}</p>}
      {notice && <p style={{ color: C.ok, fontSize: '14px', margin: '0' }}>{notice}</p>}

      <Button type="submit" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? '…' : mode === 'signup' ? 'Create account' : 'Log in'}
      </Button>

      <p style={{ fontSize: '14px', color: C.muted, margin: '4px 0 0' }}>
        {mode === 'signup' ? (
          <>Already have an account? <Link href="/login" style={{ color: C.accent }}>Log in</Link></>
        ) : (
          <>No account yet? <Link href="/signup" style={{ color: C.accent }}>Sign up</Link></>
        )}
      </p>
    </form>
  );
}
