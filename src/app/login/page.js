import { JwtLoginView } from "src/sections/auth/jwt";

// ----------------------------------------------------------------------

export const metadata = {
  title: "garage tuned autos - Login",
};

export default function LoginPage() {
  return <JwtLoginView />;
}
