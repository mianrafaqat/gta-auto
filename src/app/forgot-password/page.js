import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const ForgotPasswordPage = dynamic(() => import('src/components/forgot-password'), {
  loading: () => <Loading />,
});

export const metadata = {
  title: "garage tuned autos - Forgot Password",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
