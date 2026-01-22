"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingHero from "@/components/Hero/LandingHero";
import ThemePreview from "@/components/Hero/ThemePreview";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [status, setStatus] = useState("Connecting to backend...");

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          router.replace("/chat");
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  // Only check health if not redirecting to /chat
  useEffect(() => {
    if (isAuthenticated === false) {
      api
        .get("/health")
        .then((res) => setStatus(`Backend Status: ${res.data.status}`))
        .catch((err) => {
          console.error("Link Error:", err);
          setStatus("Backend Offline - Check port 4000");
        });
    }
  }, [isAuthenticated]);

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  // If authenticated, redirect happens automatically
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* <main>
        <div className="bg-blue-600 text-white text-center py-2 text-sm font-mono">
          {status}
        </div>
      </main> */}
      <Navbar />

      <LandingHero />
      <ThemePreview />
    </>
  );
}
