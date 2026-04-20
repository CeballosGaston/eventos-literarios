"use client"

import { useEvents } from "@/features/events/hooks/useEvents"

export default function Page() {
  const { data, isLoading, error } = useEvents()

  if (isLoading) return <p>Cargando eventos...</p>
  if (error) return <p>Error cargando eventos</p>

  return (
    <div>
      <h1>Eventos</h1>

      {data?.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  )
}