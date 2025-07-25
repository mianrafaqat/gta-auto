import React from 'react';
import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

export const metadata = {
  title: 'City Autos',
};

const MyCarsListPage = dynamic(() => import('src/components/my-cars/list'), {
  loading: () => <Loading />,
});

export default function MyCarsList() {
  return <MyCarsListPage />;
}
