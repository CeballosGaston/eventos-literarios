"use client";

import { EventCalendar } from "@/features/calendar/components/EventsCalendar";

export default function DashboardPage() {
  return (
    <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Contenedor Grid: 1 columna en móvil, 2 en pantallas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Lado Izquierdo: Calendario */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Calendario de Eventos</h2>
          <EventCalendar />
        </div>

        {/* Lado Derecho: Mapa (Espacio reservado) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Ubicación Geográfica</h2>
          <div className="h-[500px] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500">
            <span className="text-4xl mb-2">📍</span>
            <p>El mapa aparecerá aquí al lado del calendario</p>
          </div>
        </div>

      </div>
    </main>
  );
}
