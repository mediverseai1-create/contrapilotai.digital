import { AuthLeft } from '@/components/auth/AuthLeft';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="auth-shell">
      <AuthLeft kind="reset" />
      <div className="auth-right">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
