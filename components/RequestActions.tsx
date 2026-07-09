'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { C } from '@/lib/theme';

export function RequestActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: 'approve' | 'reject') {
    setLoading(action);
    setError(null);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(null);
    }
  }

  const btn = (color: string): React.CSSProperties => ({
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'inherit',
    background: 'transparent',
    color,
    border: `1px solid ${color}`,
    borderRadius: 'var(--r-pill)',
    padding: '8px 16px',
    cursor: loading !== null ? 'not-allowed' : 'pointer',
    opacity: loading !== null ? 0.55 : 1,
  });

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={() => act('approve')} disabled={loading !== null} style={btn(C.ok)}>
        {loading === 'approve' ? '…' : 'Approve'}
      </button>
      <button onClick={() => act('reject')} disabled={loading !== null} style={btn(C.high)}>
        {loading === 'reject' ? '…' : 'Reject'}
      </button>
      {error && <span style={{ color: C.high, fontSize: '13px' }}>{error}</span>}
    </div>
  );
}
