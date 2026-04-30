"use client";

import { useState, useMemo } from "react";
import { EventCalendar } from "@/features/calendar/components/EventsCalendar";
// import { EventsMap } from "@/features/map/components/EventsMap";
import { useEvents } from "@/features/events/hooks/useEvents";
import { EventItem } from "@/features/events/types";
import { EventForm } from "@/features/events/components/EventForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import dynamic from "next/dynamic";

const EventsMap = dynamic(
  () => import("@/features/map/components/EventsMap").then(m => m.EventsMap),
  { ssr: false }
);

export default function DashboardPage() {
  const { data: events = [], isLoading, refetch } = useEvents();
  const memoizedEvents = useMemo(() => events, [events]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<EventItem> | null>(
    null,
  );

  const openForm = (eventData: Partial<EventItem> | null) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };

  return (
    <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
    
      <h1 className="sr-only">Panel de Gestión de Eventos Literarios</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
        <section 
          className="space-y-4" 
          aria-labelledby="calendar-heading"
        >
          <h2 id="calendar-heading" className="text-xl font-semibold text-slate-800">
            Calendario de Eventos
          </h2>
          <div role="region" aria-label="Interacción con el calendario">
            <EventCalendar
              events={memoizedEvents}
              onDateClick={(date) => openForm({ start_date: date })}
              onEventClick={(event) => openForm(event)}
            />
          </div>
        </section>

      
        <section 
          className="space-y-4" 
          aria-labelledby="map-heading"
        >
          <h2 id="map-heading" className="text-xl font-semibold text-slate-800">
            Ubicación Geográfica
          </h2>
              <div 
            role="region" 
            aria-live="polite" 
            aria-busy={isLoading}
            className="min-h-[500px]"
          >
            {isLoading ? (
              <div 
                className="h-[500px] bg-slate-100 animate-pulse rounded-xl" 
                role="status"
                aria-label="Cargando mapa de eventos"
              />
            ) : (
              <EventsMap
                events={memoizedEvents}
                onMapClick={(lat, lng) =>
                  openForm({ latitude: lat, longitude: lng })
                }
                onMarkerClick={(event) => openForm(event)}
              />
            )}
          </div>
        </section>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
       
        <DialogContent 
          className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
          aria-describedby="event-form-description"
        >
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.id
                ? `Editar: ${selectedEvent.title}`
                : "Crear nuevo evento literario"}
            </DialogTitle>
            <p id="event-form-description" className="sr-only">
              Complete los campos del formulario para {selectedEvent?.id ? 'actualizar' : 'añadir'} un evento.
            </p>
          </DialogHeader>

          <div className="py-4">
            <EventForm
              initialData={selectedEvent as EventItem}
              onSuccess={() => {
                setIsModalOpen(false);
                refetch();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}