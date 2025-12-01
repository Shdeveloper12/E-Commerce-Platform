'use client';

import dynamic from "next/dynamic";

// Client-side only component wrapper
const FloatingCartCompare = dynamic(() => import("@/components/cart"), {
  ssr: false,
  loading: () => null,
});

export function CartCompareProvider() {
  return <FloatingCartCompare />;
}
