import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const ForgotPasswordPage = dynamic(() => import('src/components/forgot-password'), {
  loading: () => <Loading />,
});

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
