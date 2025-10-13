import dynamic from 'next/dynamic';
import React from 'react';
import Loading from 'src/app/loading';

const AdminCarAddPage = dynamic(() => import('src/components/admin/cars/add'), {
  loading: () => <Loading />,
});

export default function AdminCarAdd() {
  return <AdminCarAddPage />;
}

