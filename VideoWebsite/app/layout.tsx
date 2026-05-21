import "./global.css";

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
        <div className="page-content">{children}</div>
      </body>
    </html>
  );
} 