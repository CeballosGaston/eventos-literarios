"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { EventItem } from "../../events/types";

interface EventCalendarProps {
  events: EventItem[];
  onDateClick: (date: string) => void;
  onEventClick: (event: EventItem) => void;
}

export function EventCalendar({
  events,
  onDateClick,
  onEventClick,
}: EventCalendarProps) {
  const handleDateClick = (arg: DateClickArg) => {
    onDateClick(`${arg.dateStr}T09:00`);
  };

  const handleEventClick = (info: EventClickArg) => {
    const eventData = info.event.extendedProps as EventItem;
    onEventClick(eventData);
  };

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
          events={events.map((e) => ({
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
    </div>
  );
}
