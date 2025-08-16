import { CONFIG } from 'src/config-global';

import { OrderDetailsView } from 'src/sections/order/view';
import AuthGuard from 'src/components/auth-guard';

// ----------------------------------------------------------------------

export const metadata = { title: `Order details | Dashboard ` };

export default function Page({ params }) {
  const { id } = params;

  return (
    <AuthGuard>
      <OrderDetailsView id={id} />
    </AuthGuard>
  );
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = 'auto';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */


