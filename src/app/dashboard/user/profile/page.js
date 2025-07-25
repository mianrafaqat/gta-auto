import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const UserProfileChangePassword = dynamic(() => import('src/components/user-profile/change-password'), {
  loading: () => <Loading />,
});

export default function UserProfile() {
  return <UserProfileChangePassword />;
}
