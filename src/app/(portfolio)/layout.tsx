import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import "../globals.css";
import { draftMode } from "next/headers";
import Script from "next/script";
import { VisualEditing } from "next-sanity/visual-editing";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/DarkModeToggle";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { FloatingDock } from "@/components/FloatingDock";
import SidebarToggle from "@/components/SidebarToggle";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const siteTitle = "Mansi S. Nawlani | Software Engineer";
const siteDescription =
  "Senior Software Engineer specializing in React, Angular, TypeScript, .NET, and AI-powered applications.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mansisn.com"),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mansi S. Nawlani",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* Font variables live on <html> because globals.css applies
          font-sans there; on <body> they'd be undefined at that level. */}
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable}`}
      >
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Script
              src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
              strategy="afterInteractive"
            />

            <SidebarProvider defaultOpen={false}>
              <SidebarInset className="">{children}</SidebarInset>

              <AppSidebar side="right" />

              <FloatingDock />
              <SidebarToggle />

              {/* Mode Toggle - Desktop: bottom right next to AI chat, Mobile: top right next to burger menu */}
              {/* z-30 matches the mobile menu button: above page sections
                  (some use z-10) so taps always reach it. */}
              <div className="fixed md:bottom-6 md:right-24 top-4 right-18 md:top-auto md:left-auto z-30">
                <div className="w-12 h-12">
                  <ModeToggle />
                </div>
              </div>
            </SidebarProvider>

            {/* Live content API */}
            <SanityLive />

            {(await draftMode()).isEnabled && (
              <>
                <VisualEditing />
                <DisableDraftMode />
              </>
            )}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
