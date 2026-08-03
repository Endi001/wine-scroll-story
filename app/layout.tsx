import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison Noir — Wine for those who love to live",
  description:
    "A family estate crafting single-vineyard Médoc wines since 1897. Slow, honest, unforgettable.",
  openGraph: {
    title: "Maison Noir — Wine for those who love to live",
    description:
      "A family estate crafting single-vineyard Médoc wines since 1897. Slow, honest, unforgettable.",
    type: "website",
    images: [
      {
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cb835472-03c8-4e77-bdee-128f7da14a30/id-preview-e8e67362--8adccaae-57e9-4595-b8b8-cedd57845cc5.lovable.app-1784043083703.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Noir — Wine for those who love to live",
    description:
      "A family estate crafting single-vineyard Médoc wines since 1897. Slow, honest, unforgettable.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cb835472-03c8-4e77-bdee-128f7da14a30/id-preview-e8e67362--8adccaae-57e9-4595-b8b8-cedd57845cc5.lovable.app-1784043083703.png",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-60Y4SQEQGH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-60Y4SQEQGH');
          `}
        </Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
