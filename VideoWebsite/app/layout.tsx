import "./global.css";
import { TopBar } from "./components/topbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <div className="background-logo" />
        <div className="background-overlay" />
        <TopBar />
        <div className="page-content">{children}</div>
        <footer className="site-footer">© 2026 Samuel</footer>
      </body>
    </html>
  );
}
