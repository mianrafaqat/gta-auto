import dynamic from "next/dynamic";
import Loading from "src/app/loading";

export const metadata = () => {
  return {
    title: "gtaAutos: Services",
  };
};

const Services = dynamic(() => import("src/components/services"), {
  loading: () => <Loading />,
});

export default function ServicesPage() {
  return <Services />;
}
