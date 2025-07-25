import dynamic from 'next/dynamic';
import React from 'react';
import Loading from 'src/app/loading';

const AdminUserListPage = dynamic(() => import('src/components/admin/users/list'), {
  loading: () => <Loading />,
});

export default function AdminUserList() {
  return <AdminUserListPage />;
}
