import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

export const metadata = () => {
  return {
    title: 'gtaAutos: Privacy Policy'
  }
}

const PrivacyPolicy = dynamic(() => import('src/components/privacy-policy'), {
  loading: () => <Loading />,
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
