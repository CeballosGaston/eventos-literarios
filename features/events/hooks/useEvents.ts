"use client"

import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../services/eventService"

export function useEvents(filters?: {
  type?: string
  date?: string
  zone?: string
}) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => getEvents(filters),
  })
}