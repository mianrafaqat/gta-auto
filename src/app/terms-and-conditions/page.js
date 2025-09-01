import dynamic from "next/dynamic";
import Loading from "src/app/loading";

export const metadata = () => {
  return {
    title: "garage tuned autos: Terms-and-Conditions",
  };
};

const TermsAndConditions = dynamic(
  () => import("src/components/terms-and-conditions"),
  {
    loading: () => <Loading />,
  }
);

export default function TermsAndConditionsPage() {
  return <TermsAndConditions />;
}
