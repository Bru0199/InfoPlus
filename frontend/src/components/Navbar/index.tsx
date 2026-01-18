"use client";

import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/components/AuthModalProvider";

export default function Navbar() {
  const { open } = useAuthModal();

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
        <Button className="btn-primary" type="button" onClick={open}>
          Login
        </Button>
        <Button className="btn-outline" type="button" onClick={open}>
          Sign Up
        </Button>
      </div>
    </nav>
  );
}
