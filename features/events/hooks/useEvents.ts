"use client"

import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../services/eventService"

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  })
}