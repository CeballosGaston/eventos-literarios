"use client";

import { useState, useMemo } from "react";
import { EventCalendar } from "@/features/calendar/components/EventsCalendar";
import { EventsMap } from "@/features/map/components/EventsMap";
import { useEvents } from "@/features/events/hooks/useEvents";
import { EventItem } from "@/features/events/types";
import { EventForm } from "@/features/events/components/EventForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Calendario de Eventos
          </h2>
          <EventCalendar
            events={memoizedEvents}
            onDateClick={(date) => openForm({ start_date: date })}
            onEventClick={(event) => openForm(event)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Ubicación Geográfica
          </h2>
          {isLoading ? (
            <div className="h-[500px] bg-slate-100 animate-pulse rounded-xl" />
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
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.id
                ? `Editar: ${selectedEvent.title}`
                : "Crear nuevo evento literario"}
            </DialogTitle>
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
