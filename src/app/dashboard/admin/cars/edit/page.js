import dynamic from 'next/dynamic';
import React from 'react';
import Loading from 'src/app/loading';

const AdminCarEditPage = dynamic(() => import('src/components/admin/cars/edit'), {
  loading: () => <Loading />,
});

export default function AdminCarEdit() {
  return <AdminCarEditPage />;
}

