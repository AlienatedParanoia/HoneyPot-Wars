'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { C } from '@/lib/theme';
import { labelStyle } from '@/components/Shell';
import { Button } from '@/components/ui/button';

export function UploadReportForm({ accountId }: { accountId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState<'technical' | 'summary' | 'other'>('technical');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(false);
    const form = new FormData(e.currentTarget);
    form.set('accountId', accountId);
    form.set('title', title);
    form.set('reportType', reportType);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports', { method: 'POST', body: form });
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      setDone(true);
      setTitle('');
      formRef.current?.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={labelStyle} htmlFor="title">Report title</label>
        <input id="title" className="hw-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Q2 coverage assessment" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="type">Report type</label>
        <select id="type" className="hw-input" value={reportType} onChange={(e) => setReportType(e.target.value as typeof reportType)}>
          <option value="technical">Technical</option>
          <option value="summary">Executive summary</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label style={labelStyle} htmlFor="file">File (PDF, max 25MB)</label>
        <input id="file" name="file" type="file" accept="application/pdf,.pdf" required className="hw-input" style={{ padding: '9px' }} />
      </div>
      {error && <p style={{ color: C.high, fontSize: '14px', margin: '0' }}>{error}</p>}
      {done && <p style={{ color: C.ok, fontSize: '14px', margin: '0' }}>Report uploaded.</p>}
      <Button type="submit" disabled={loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? 'Uploading…' : 'Upload report'}
      </Button>
    </form>
  );
}
