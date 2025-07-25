import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const ResetPasswordPage = dynamic(() => import('src/components/reset-password'), {
  loading: () => <Loading />,
});

export default function ForgotPassword() {
  return <ResetPasswordPage />;
}
