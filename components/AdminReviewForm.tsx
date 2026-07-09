'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { C } from '@/lib/theme';
import { labelStyle } from '@/components/Shell';
import { Button } from '@/components/ui/button';

export function AdminReviewForm({ accountId, sessionRequestId }: { accountId: string; sessionRequestId: string }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [verdict, setVerdict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, sessionRequestId, body, verdict: verdict || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setDone(true);
      setBody('');
      setVerdict('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
      <div>
        <label style={labelStyle}>Verdict (optional, short)</label>
        <input className="hw-input" value={verdict} onChange={(e) => setVerdict(e.target.value)} placeholder="e.g. Needs attention" maxLength={80} />
      </div>
      <div>
        <label style={labelStyle}>Review</label>
        <textarea className="hw-input" style={{ minHeight: '80px', resize: 'vertical' }} value={body} onChange={(e) => setBody(e.target.value)} required />
      </div>
      {error && <p style={{ color: C.high, fontSize: '14px', margin: 0 }}>{error}</p>}
      {done && <p style={{ color: C.ok, fontSize: '14px', margin: 0 }}>Review posted.</p>}
      <Button type="submit" size="sm" disabled={loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? '…' : 'Post review'}
      </Button>
    </form>
  );
}
