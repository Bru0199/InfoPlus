"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Parse the page to check if it's an error response from backend
    const bodyText = document.body.innerText;
    
    try {
      const errorJson = JSON.parse(bodyText);
      
      if (errorJson.success === false && errorJson.error) {
        // Show error toast
        toast.error("Login failed", {
          description: errorJson.error,
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.replace("/login");
        }, 1000);
      } else if (errorJson.success === true) {
        // Backend returned success, redirect to chat
        setTimeout(() => {
          router.replace("/chat");
        }, 500);
      }
    } catch (e) {
      // Not JSON, maybe backend did redirect properly
      // Check if we got a session by calling auth/me
      setTimeout(() => {
        router.replace("/chat");
      }, 500);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-[var(--text-muted)]">Completing login...</p>
      </div>
    </div>
  );
}
