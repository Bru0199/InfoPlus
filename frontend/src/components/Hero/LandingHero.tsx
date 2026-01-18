"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 transition-colors duration-300">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300">
        Smarter Answers, Right When You Need Them
      </h1>

      <p className="font-mono text-lg md:text-xl mb-8 transition-colors duration-300">
        Live data, live insights — all in one AI assistant
      </p>

      <Link href="/api/auth/signin">
        <button
          className=" btn-primary text-white font-semibold rounded-lg px-8 py-4 text-lg animate-bounce-up-down hover:scale-105 hover:[animation-play-state:paused] transition-transform">
          Get Started
        </button>

      </Link>
    </main>
  );
}
