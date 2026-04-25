"use client";

import { useEvents } from "@/features/events/hooks/useEvents";
import { useFilters } from "../../../features/filters/context/FiltersContext";

export default function DashboardPage() {
  const { filters } = useFilters();
  const { data: events } = useEvents(filters);

  return (
    <div>
      <h1>Events</h1>

      {events?.map((e) => (
        <div key={e.id}>
          <p>{e.title}</p>
          <p>
            {e.start_date} - {e.end_date}
          </p>
        </div>
      ))}
    </div>
  );
}