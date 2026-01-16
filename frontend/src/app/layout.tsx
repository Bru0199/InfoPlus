import "./globals.css";
import { inter, firaCode } from "../lib/fonts";

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
    <html lang="en">
      <body className={`${inter.variable} ${firaCode.variable}`}>
        {children}
      </body>
    </html>
  );
}
