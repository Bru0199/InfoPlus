import "./globals.css";
import { inter, firaCode } from "../lib/fonts";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata = {
  title: "InfoPulse",
  description: "AI-powered assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable}`}>
        <ThemeProvider>
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
