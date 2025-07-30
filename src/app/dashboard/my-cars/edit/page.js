import React from 'react';
import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

export const metadata = {
  title: 'GTA Auto',
};

const MyCarsEditPage = dynamic(() => import('src/components/my-cars/edit'), {
  loading: () => <Loading />,
});

export default function MyCarsList() {
  return <MyCarsEditPage />;
}
