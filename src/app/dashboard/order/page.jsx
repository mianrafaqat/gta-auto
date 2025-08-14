import { CONFIG } from 'src/config-global';

import { OrderListView } from 'src/sections/order/view';
import AuthGuard from 'src/components/auth-guard';

// ----------------------------------------------------------------------

export const metadata = { title: `Order list | Dashboard - ` };

export default function Page() {
  return (
    <AuthGuard>
      <OrderListView />
    </AuthGuard>
  );
}
