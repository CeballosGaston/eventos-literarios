// app/layout.tsx
import ReactQueryProvider from "@/shared/providers/ReactQueryProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "../shared/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ReactQueryProvider>
          <Navbar />
          {children}
          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
