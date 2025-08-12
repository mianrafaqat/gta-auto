import dynamic from "next/dynamic";
import Loading from "src/app/loading";

export const metadata = () => {
  return {
    title: "gtaAutos: Support",
  };
};

const Support = dynamic(() => import("src/components/support"), {
  loading: () => <Loading />,
});

export default function SupportPage() {
  return <Support />;
}
