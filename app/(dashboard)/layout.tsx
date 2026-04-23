"use client";

import { useState } from "react";
import { EventFilters } from "@/features/events/types";
import { EventSidebar } from "./components/EventSidebar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<EventFilters>({});

  return (
    <div className="flex min-h-screen">
      <EventSidebar filters={filters} setFilters={setFilters} />

      <main className="flex-1 p-8 bg-slate-50">{children}</main>
    </div>
  );
}
