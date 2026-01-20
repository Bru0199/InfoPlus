"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bot, LogOut, Settings, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{
    name: string;
    image?: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Check real auth status from your backend
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data && res.data.user) setUser(res.data.user);
      })
      .catch(() => setUser(null));
  }, []);

  const handleSignOut = async () => {
    // Redirect to your backend logout route
    try {
      await api.get("/auth/logout");

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // window.location.href = "/login";
    }
  };

  // const { toggleSidebar } = useSidebar();

  const handleClearHistory = async () => {};

  return (
    <nav className="flex justify-between items-center px-6 md:px-8 py-4 bg-[var(--bg-main)] border-b border-[var(--border)] transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* Left side: Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-[var(--brand-blue)] items-center justify-center">
            <Bot size={26} className="text-white" />
          </div>
          <span className="font-bold text-2xl transition-colors duration-300">
            <span className="brand-info">Info</span>
            <span className="brand-plus">Plus</span>
          </span>
        </Link>
      </div>

      {/* Right side: Dynamic Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        {user ? (
          /* LOGGED IN VIEW */
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-center gap-1 sm:gap-2 p-3 hover:bg-[var(--hover-color)] transition-all"
              >
                <Avatar className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage
                    src={user.image}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <AvatarFallback className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full text-xs sm:text-sm text-[var(--text-primary)] text-center bg-[var(--hover-color)]">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <span className="text-xs sm:text-sm font-medium hidden sm:inline text-[var(--text-primary)]">
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-[var(--bg-muted)] border-[var(--border)] rounded-xl shadow-xl"
            >
              <DropdownMenuLabel className="text-[var(--text-muted)]">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--text-primary)]">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-[var(--text-muted)] opacity-70">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--border)]" />

              <DropdownMenuItem className="cursor-pointer focus:bg-[var(--hover-color)]">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer focus:bg-[var(--hover-color)]">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[var(--border)]" />

              <DropdownMenuItem
                onClick={handleClearHistory}
                className="text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear All Chats</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[var(--border)]" />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer focus:bg-[var(--hover-color)]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          /* LOGGED OUT VIEW */
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="btn-primary text-sm px-5">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
