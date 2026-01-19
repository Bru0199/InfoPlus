"use client";

import LandingHero from "@/components/Hero/LandingHero";
import ThemePreview from "@/components/Hero/ThemePreview";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

export default function Home() {
  const [status, setStatus] = useState("Connecting to backend...");

  useEffect(() => {
    // Calling the /health route on Port 4000
    api
      .get("/health")
      .then((res) => setStatus(`Backend Status: ${res.data.status}`))
      .catch((err) => {
        console.error("Link Error:", err);
        setStatus("Backend Offline - Check port 4000");
      });
  }, []);

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
