import { Suspense } from 'react';
import { AuthLeft } from '@/components/auth/AuthLeft';
import { SignInForm } from './SignInForm';

export default function SignInPage() {
  return (
    <div className="auth-shell">
      <AuthLeft kind="signin" />
      <div className="auth-right">
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
