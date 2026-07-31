import type { Metadata } from "next";
import "./globals.css";
import Starfield from "./starfield";
import { CursorGlow } from "./ui";

export const metadata: Metadata = {
  title: "Oiiii",
  description: "An interactive memory film.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative h-[100dvh] w-screen overflow-hidden antialiased">
        <div className="aurora pointer-events-none fixed inset-0 -z-20" />
        <Starfield />
        {children}
        <div className="vignette pointer-events-none fixed inset-0 z-40" />
        <div className="grain pointer-events-none fixed inset-0 z-40" />
      </body>
    </html>
  );
}
