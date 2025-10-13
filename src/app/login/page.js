import { JwtLoginView } from "src/sections/auth/jwt";

// ----------------------------------------------------------------------

export const metadata = {
  title: "garage tuned autos - Login",
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

export default function LoginPage() {
  return <JwtLoginView />;
}
