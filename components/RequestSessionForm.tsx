'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { C } from '@/lib/theme';
import { labelStyle } from '@/components/Shell';
import { Button } from '@/components/ui/button';

export function RequestSessionForm({ accountId }: { accountId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [repoUrl, setRepoUrl] = useState('');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) { setError('You must agree to the testing scope and terms.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from('session_requests').insert({
        account_id: accountId,
        repo_url: repoUrl,
        deployment_url: deploymentUrl || null,
        notes: notes || null,
        consent_signed: true,
      });
      if (error) throw error;
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <label style={labelStyle} htmlFor="repo">GitHub repository URL</label>
        <input id="repo" className="hw-input" type="url" placeholder="https://github.com/you/your-repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} required />
      </div>
      <div>
        <label style={labelStyle} htmlFor="deploy">Deployed app URL (optional)</label>
        <input id="deploy" className="hw-input" type="url" placeholder="https://app.example.com" value={deploymentUrl} onChange={(e) => setDeploymentUrl(e.target.value)} />
      </div>
      <div>
        <label style={labelStyle} htmlFor="notes">Anything we should know? (optional)</label>
        <textarea id="notes" className="hw-input" style={{ minHeight: '90px', resize: 'vertical' }} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', lineHeight: 1.55, color: C.muted, cursor: 'pointer' }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: C.accent, flex: 'none' }} />
        <span>
          I agree that testing is limited to the domain I registered, that no raw payloads or secrets are stored, and
          I accept the limitation of liability.
        </span>
      </label>

      {error && <p style={{ color: C.high, fontSize: '14px', margin: '0' }}>{error}</p>}

      <Button type="submit" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? '…' : 'Request session'}
      </Button>
    </form>
  );
}
