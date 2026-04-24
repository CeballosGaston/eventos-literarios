"use client";

import { EventSidebar } from "./components/EventSidebar";
import type { ReactNode } from "react";
import { FiltersProvider } from "../../features/filters/context/FiltersContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <FiltersProvider>
      <div className="flex min-h-screen">
        <EventSidebar />

        <main className="flex-1 p-8 bg-slate-50">{children}</main>
      </div>
    </FiltersProvider>
  );
}
