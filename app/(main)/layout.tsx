// app/(main)/layout.tsx
import { Navbar } from "@/shared/components/layout/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-6">{children}</main>
    </>
  );
}