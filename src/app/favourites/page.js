import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const FavouritesCarPage = dynamic(() => import('src/components/favourites'), {
  loading: () => <Loading />,
});

export const metadata = {
  title: 'GTA Auto - My Favourites'
}

export default function Favourites() {
  return <FavouritesCarPage />;
}
