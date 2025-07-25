import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const FavouritesCarPage = dynamic(() => import('src/components/favourites'), {
  loading: () => <Loading />,
});

export const metadata = {
  title: 'City Autos - My Favourites'
}

export default function Favourites() {
  return <FavouritesCarPage />;
}
