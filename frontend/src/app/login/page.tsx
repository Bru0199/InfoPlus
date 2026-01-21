"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Calling your specific auth/me endpoint
        const res = await api.get("/auth/me");

        // If the backend returns user data, jump straight to chat
        if (res.data && res.data.user) {
          router.replace("/chat");
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        // 401 Unauthorized or error means stay on login page
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = (provider: "google" | "github") => {
    const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const base = rawBase.replace(/\/$/, "");
    const authBase = base.endsWith("/api") ? base : `${base}/api`;
    window.location.href = `${authBase}/auth/${provider}`;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4 transition-colors duration-300">
      <div className="w-full max-w-sm space-y-8 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-muted)] p-10 shadow-sm">
        {/* Brand Logo / Name */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="brand-info">Info</span>
            <span className="brand-plus">Plus</span>
          </h1>
          <h2 className="text-xl text-[var(--text-muted)] font-medium">
            Log in or Sign up
          </h2>
          <span className="font-firaCode text-sm">
            You’ll get smarter response
          </span>
        </div>

        <div className="grid gap-4">
          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full py-6 text-base font-semibold border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--hover-color)] transition-all rounded-[var(--radius)]"
            onClick={() => handleLogin("google")}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          {/* GitHub Button - Styled identically to Google */}
          <Button
            variant="outline"
            className="w-full py-6 text-base font-semibold border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--hover-color)] transition-all rounded-[var(--radius)]"
            onClick={() => handleLogin("github")}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.792 1.301 1.915 1.144 2.383.876.088-.573.317-.964.572-1.187-2.21-.25-4.535-1.105-4.535-4.922 0-1.088.387-1.978 1.022-2.677-.102-.251-.443-1.265.097-2.639 0 0 .837-.268 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.912-1.293 2.748-1.025 2.748-1.025.54 1.374.199 2.388.098 2.639.636.699 1.021 1.589 1.021 2.677 0 3.827-2.329 4.67-4.544 4.915.357.307.675.913.675 1.84 0 1.329-.012 2.4-.012 2.727 0 .268.18.578.688.481A9.999 9.999 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-[var(--text-muted)] opacity-70">
            By continuing, you agree to InfoPlus Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
