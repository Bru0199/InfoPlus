//src/app/chat/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/Chat/ChatWindow";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Mark this page as dynamic - don't prerender statically
export const dynamic = "force-dynamic";

export default function ConversationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-blue)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <ChatWindow />;
}
