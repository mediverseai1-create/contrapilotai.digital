import { AuthLeft } from '@/components/auth/AuthLeft';
import { ResetPasswordForm } from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="auth-shell">
      <AuthLeft kind="reset" />
      <div className="auth-right">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
