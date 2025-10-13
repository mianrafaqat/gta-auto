import { OverviewAppView } from "src/sections/overview/app/view";

export const metadata = {
  title: "garage tuned autos - Dashboard",
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

export default function OverviewAppPage() {
  return <OverviewAppView />;
}
