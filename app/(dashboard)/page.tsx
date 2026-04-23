"use client";

import { useEvents } from "@/features/events/hooks/useEvents";

export default function DashboardPage() {
  const { data: events, isLoading } = useEvents();

  return (
    <div>
      <h1>Home</h1>

      {events?.map((e) => (
        <div key={e.id}>{e.title}</div>
      ))}
    </div>
  );
}
