import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

/*
todo: i've done this before so i want to remind myself now but
todo: make sure that when i go to inject client-side components
todo: here that i break it out into separate files so i don't have
todo: a giant list of dynamic imports in the root layout
*/

const ClientSide = dynamic(() => import("@components/ClientSide"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Portfolio | Marco Tan",
  description: "Portfolio website for Marco Tan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientSide>{children}</ClientSide>
      </body>
    </html>
  );
}
