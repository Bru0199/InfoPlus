"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function LinkProviderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = searchParams.get("email");
  const provider = searchParams.get("provider");
  const existingProvider = searchParams.get("existing_provider");

  useEffect(() => {
    if (!email || !provider || !existingProvider) {
      setError("Invalid link request. Missing required parameters.");
    }
  }, [email, provider, existingProvider]);

  const handleLinkProvider = async () => {
    if (!email || !provider) return;

    setIsLoading(true);
    try {
      const res = await api.post("/auth/link-provider", {
        email,
        provider,
      });

      if (res.data.success) {
        toast.success("Account linked successfully!", {
          description: `Your ${provider} account has been linked to your ${existingProvider} account.`,
        });
        setTimeout(() => {
          router.replace("/chat");
        }, 1500);
      } else {
        toast.error("Failed to link account", {
          description: res.data.error || "Please try again.",
        });
        setError(res.data.error);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to link account";
      toast.error("Error", {
        description: errorMsg,
      });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.replace("/login");
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
            Link Your Account
          </h2>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-[var(--radius)] text-sm">
            <p className="font-semibold">Error</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}

        {/* Content */}
        {!error && email && provider && existingProvider && (
          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-[var(--bg-main)] border border-[var(--border)] rounded-[var(--radius)] p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-muted)]">
                  Email Address
                </p>
                <p className="text-base font-semibold text-[var(--text-primary)]">
                  {email}
                </p>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <div className="space-y-3">
                <p className="text-sm text-[var(--text-muted)]">
                  You already have an account with
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {existingProvider === "google" ? "G" : "GH"}
                  </div>
                  <span className="font-semibold capitalize">
                    {existingProvider}
                  </span>
                </div>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <div className="space-y-3">
                <p className="text-sm text-[var(--text-muted)]">
                  Link your{" "}
                  <span className="font-semibold capitalize">{provider}</span>{" "}
                  account
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-300 flex items-center justify-center text-white dark:text-gray-800 text-xs font-bold">
                    {provider === "github" ? "GH" : "G"}
                  </div>
                  <span className="font-semibold capitalize">{provider}</span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-2 text-center">
              <p className="text-sm text-[var(--text-muted)]">
                You can use either account to log in. Your data will be shared
                across both providers.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3">
              <Button
                onClick={handleLinkProvider}
                disabled={isLoading}
                className="w-full py-6 text-base font-semibold bg-[var(--text-primary)] text-[var(--bg-main)] hover:opacity-90 rounded-[var(--radius)]"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Linking...
                  </>
                ) : (
                  `Link ${provider === "github" ? "GitHub" : "Google"}`
                )}
              </Button>

              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="outline"
                className="w-full py-6 text-base font-semibold border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--hover-color)] rounded-[var(--radius)]"
              >
                Cancel
              </Button>
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[var(--radius)] p-4">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                ℹ️ <span className="font-semibold">Security:</span> We verify
                your email before linking. No passwords are stored.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
