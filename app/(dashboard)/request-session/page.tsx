import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { RequestSessionForm } from '@/components/RequestSessionForm';
import { SignOutButton } from '@/components/SignOutButton';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { C } from '@/lib/theme';
import type { SessionRequest } from '@/lib/types';

export default async function RequestSessionPage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data: pending } = await supabase
    .from('session_requests')
    .select('*')
    .eq('account_id', user.id)
    .eq('status', 'pending')
    .maybeSingle<SessionRequest>();

  return (
    <Shell title="Request a session" subtitle="Book your security assessment." right={<SignOutButton />}>
      {pending ? (
        <div>
          <p style={{ fontSize: '15px', color: C.ok, lineHeight: 1.6, margin: '0 0 20px' }}>
            You already have a pending request. Our team will review it and approve your session.
          </p>
          <Link href="/dashboard" style={{ color: C.accent, fontSize: '14px' }}>
            ← Back to dashboard
          </Link>
        </div>
      ) : (
        <RequestSessionForm accountId={user.id} />
      )}
    </Shell>
  );
}
