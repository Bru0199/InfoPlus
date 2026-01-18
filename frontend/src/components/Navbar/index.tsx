"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-sm duration-300">
      {/* Logo + InfoPlus */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full" /> {/* Logo styled via global.css */}
        <span className="font-bold text-2xl transition-colors duration-300">
          <span className="brand-info">Info</span>
          <span className="brand-plus">Plus</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/api/auth/signin">
          <Button className="btn-primary">Login</Button>
        </Link>
        <Link href="/api/auth/signup">
          <Button className="btn-outline">Sign Up</Button>
        </Link>
      </div>
    </nav>
  );
}
