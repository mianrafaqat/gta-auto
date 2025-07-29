import React from 'react';
import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

export const metadata = () => {
  return {
    title: "gtaAutos: Add Car"
  }
}

const AddNewCarPage = dynamic(() => import('src/components/my-cars/add'), {
  loading: () => <Loading />,
});

export default function MyCarsList() {
  return <AddNewCarPage />;
}
