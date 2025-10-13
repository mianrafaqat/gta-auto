export const metadata = {
  title: "garage tuned autos - Verify",
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

export default function VerifyLayout({ children }) {
  return <>{children}</>;
}
