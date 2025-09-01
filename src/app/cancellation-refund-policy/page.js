import dynamic from "next/dynamic";
import Loading from "src/app/loading";

export const metadata = () => {
  return {
    title: "garage tuned autos: Cancellation and Refund Policy",
  };
};

const RefundAndCancelation = dynamic(
  () => import("src/components/refund-and-cancelation"),
  {
    loading: () => <Loading />,
  }
);

export default function RefundAndCancelationPage() {
  return <RefundAndCancelation />;
}
