import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CustomSessionProvider } from "@/components/providers/custom-session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Scheduler - Schedule Your Social Media Posts",
  description: "Manage and schedule your social media posts across multiple platforms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <CustomSessionProvider>
            {children}
          </CustomSessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}