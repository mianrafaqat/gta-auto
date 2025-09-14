"use client";

import { CONFIG } from "src/config-global";

import TrackOrder from "src/sections/track-order";
import AuthGuard from "src/components/auth-guard";

// ----------------------------------------------------------------------

export default function TrackOrderPage() {
  return (
    <>
      <AuthGuard>
        <TrackOrder />
      </AuthGuard>
    </>
  );
}
