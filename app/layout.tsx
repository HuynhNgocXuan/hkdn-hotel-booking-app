import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import { Toaster } from "@/components/ui/sonner";
import "mapbox-gl/dist/mapbox-gl.css";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";
import LocationFilterClient from "@/components/LocationFilterClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking-Hotel @xh@",
  description: "Book a hotel of your choice",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex flex-col min-h-screen bg-secondary">
              <script
                dangerouslySetInnerHTML={{
                  __html: `
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/68de6165243dae1952fee027/1j6iaot80';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
      })();
    `,
                }}
              />
              <NavBar />
              <LocationFilterClient />
              <section className="flex-grow">
                <Container> {children}</Container>
              </section>
              <Footer />
            </main>
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
