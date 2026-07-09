import { redirect } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { AuthForm } from '@/components/AuthForm';
import { getUser } from '@/lib/auth';

export default async function LoginPage() {
  if (await getUser()) redirect('/dashboard');
  return (
    <Shell title="Log in" subtitle="Access your security dashboard." maxWidth="560px">
      <AuthForm mode="login" />
    </Shell>
  );
}
