import { AuthLeft } from '@/components/auth/AuthLeft';
import { SignUpForm } from './SignUpForm';

export default function SignUpPage() {
  return (
    <div className="auth-shell">
      <AuthLeft kind="signup" />
      <div className="auth-right">
        <SignUpForm />
      </div>
    </div>
  );
}
