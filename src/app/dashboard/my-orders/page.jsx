import { CONFIG } from 'src/config-global';

import { MyOrdersView } from 'src/sections/order/view';
import AuthGuard from 'src/components/auth-guard';

// ----------------------------------------------------------------------

export const metadata = { title: `My Orders` };

export default function Page() {
  return (
    <AuthGuard>
      <MyOrdersView />
    </AuthGuard>
  );
}
