"use client"

import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../services/eventService"
import { EventItem } from "../types"

export function useEvents() {
  return useQuery<EventItem[]>({
    queryKey: ["events"],
    queryFn: getEvents,
  })
}