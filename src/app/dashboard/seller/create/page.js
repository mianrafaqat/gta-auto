import dynamic from 'next/dynamic';
import Loading from 'src/app/loading';

const SellerCreatePage = dynamic(() => import('../../../../components/seller/create'), {
  loading: () => <Loading />,
});
export default function SellerCreate() {
  return <SellerCreatePage />;
}
