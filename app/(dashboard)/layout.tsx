"use client";

import { EventSidebar } from "./components/EventSidebar";
import type { ReactNode } from "react";
import { FiltersProvider } from "../../features/filters/context/FiltersContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <FiltersProvider>
      
      <div className="flex min-h-screen" role="none">
        
       
        <aside 
          className="shrink-0" 
          aria-label="Navegación lateral de eventos"
        >
          <EventSidebar />
        </aside>

       
        <main 
          id="main-content"
          className="flex-1 p-8 bg-slate-50 outline-none"
          tabIndex={-1} 
        >
          {children}
        </main>
      </div>
    </FiltersProvider>
  );
}