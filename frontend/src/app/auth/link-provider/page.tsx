"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LinkProviderRedirect() {
  const router = useRouter();

  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.replace(`/link-provider${search}`);
  }, [router]);

  return null;
}
