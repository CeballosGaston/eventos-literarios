// 1. Imports (los que ya tienes)
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabaseClient";
import { useState } from "react";
import { EventItem } from "../../events/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { EventForm } from "@/features/events/components/EventForm";

export function EventCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [initialDate, setInitialDate] = useState<string | null>(null);

  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) throw error;
      return data as EventItem[];
    },
  });

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedEvent(null);
    setInitialDate(`${arg.dateStr}T09:00`);
    setIsModalOpen(true);
  };

  const handleEventClick = (info: EventClickArg) => {
    const eventData = info.event.extendedProps as EventItem;
    setSelectedEvent(eventData);
    setInitialDate(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    console.log("¡Evento guardado con éxito!");
    setIsModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          height="auto"
          aspectRatio={1.2}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }}
          dayMaxEvents={2}
          eventDisplay="block"
          events={events?.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.start_date,
            end: e.end_date,
            extendedProps: { ...e },
            backgroundColor: "#3b82f6",
            borderColor: "#2563eb",
            textColor: "#ffffff",
          }))}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent
                ? `Editar: ${selectedEvent.title}`
                : "Crear evento"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EventForm
              initialData={
                selectedEvent ||
                (initialDate
                  ? ({ start_date: initialDate } as EventItem)
                  : undefined)
              }
              onSuccess={handleSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
