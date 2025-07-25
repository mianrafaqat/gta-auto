import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const SellerEditPage = dynamic(() => import('../../../../components/seller/edit'), {
  loading: () => <Loading />,
});
export default function SellerEdit() {
  return <SellerEditPage />;
}
