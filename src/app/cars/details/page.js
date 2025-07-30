import dynamic from "next/dynamic";
import Loading from "src/app/loading";

const CarsDetailPage = dynamic(() => import("src/components/cars/details"), {
  loading: () => <Loading />,
});

export const metadata = {
  title: "GTA Auto - Car Details",
};

export default function CarDetails() {
  return <CarsDetailPage />;
}
