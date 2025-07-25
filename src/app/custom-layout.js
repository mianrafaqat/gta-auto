"use client";

import React, { useEffect, useState } from "react";
import Loading from "./loading";

export default function CustomLayout({ children }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  return <>{loading ? <Loading /> : children}</>;
}
