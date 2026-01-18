"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close authentication modal"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--bg-main)] p-6 text-left shadow-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Log in or sign up
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-sm text-[var(--text-primary)] hover:bg-[var(--hover-color)]"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Choose a provider to continue.
        </p>
        <div className="mt-6 space-y-3">
          <Button
            asChild
            variant="outline"
            className="btn-outline w-full justify-center"
          >
            <Link href="/api/auth/signin?provider=google">
              Continue with Google
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="btn-outline w-full justify-center"
          >
            <Link href="/api/auth/signin?provider=github">
              Continue with GitHub
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
