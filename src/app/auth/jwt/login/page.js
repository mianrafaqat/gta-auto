import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'City Autos - Login',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
