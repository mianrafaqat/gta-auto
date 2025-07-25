import dynamic from 'next/dynamic';
import React from 'react';
import Loading from 'src/app/loading';

const AdminCarListPage = dynamic(() => import('src/components/admin/cars/list'), {
  loading: () => <Loading />,
});

export default function AdminCarList() {
  return <AdminCarListPage />;
}
