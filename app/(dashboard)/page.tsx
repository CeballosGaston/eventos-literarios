"use client";

import { EventCalendar } from "@/features/calendar/components/EventsCalendar";
import { EventsMap } from "@/features/map/components/EventsMap";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useMemo } from "react";

export default function DashboardPage() {
  const { data: events = [], isLoading } = useEvents();
  const memoizedEvents = useMemo(() => events, [events]);

  return (
    <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Lado Izquierdo: Calendario */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Calendario de Eventos
          </h2>
          <EventCalendar />
        </div>

        {/* Lado Derecho: Mapa (Espacio reservado) */}
       <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Ubicación Geográfica</h2>
          
          {isLoading ? (
            <div className="h-[500px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center">
              <p className="text-slate-500">Cargando mapa...</p>
            </div>
          ) : (
            <EventsMap events={memoizedEvents} />
          )}
        </div>
      </div>
    </main>
  );
}
