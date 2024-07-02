import type { Metadata } from "next";
import "./globals.css";
import SessionProviderFunction from "@/components/session/SessionProviderFunction";

export const metadata: Metadata = {
  title: "SponsorTheKingdom",
  description: "Sponsor our warriors in the Kingdom of God, and help us spread the Gospel to the ends of the earth, Getting feedback from the field, and seeing the impact of your support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald&display=swap"
          rel="stylesheet"
        />
      </head> */}
      <body className="min-h-full ">
        <SessionProviderFunction>{children}</SessionProviderFunction>
      </body>
    </html>
  );
}
