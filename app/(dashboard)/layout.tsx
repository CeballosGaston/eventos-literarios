// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Aquí podrías poner un Sidebar lateral pro en el futuro */}
      <aside className="w-64 bg-slate-900 text-white p-4 hidden md:block">
        Dashboard Menu
      </aside>
      <main className="flex-1 p-8 bg-slate-50">{children}</main>
    </div>
  );
}