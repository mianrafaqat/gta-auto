import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const SellerListPage = dynamic(() => import('../../../../components/seller/list'), {
  loading: () => <Loading />,
});

export default function SellerList() {
  return <SellerListPage />;
}
