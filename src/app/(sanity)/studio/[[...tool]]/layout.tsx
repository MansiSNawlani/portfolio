import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mansi S. Nawlani | Software Engineer",
  description: "Portfolio Studio",
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default Layout;
