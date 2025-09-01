import dynamic from "next/dynamic";
import Loading from "src/app/loading";

const FavouritesCarPage = dynamic(() => import("src/components/favourites"), {
  loading: () => <Loading />,
});

export const metadata = {
  title: "garage tuned autos - My Favourites",
};

export default function Favourites() {
  return <FavouritesCarPage />;
}
