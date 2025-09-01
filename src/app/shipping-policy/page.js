import dynamic from "next/dynamic";
import Loading from "src/app/loading";

export const metadata = () => {
  return {
    title: "garage tuned autos: Shipping Policy",
  };
};

const ShippingPolicy = dynamic(() => import("src/components/shipping-policy"), {
  loading: () => <Loading />,
});

export default function ShippingPolicyPage() {
  return <ShippingPolicy />;
}
