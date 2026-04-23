"use client"

import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../services/eventService"
import { EventFilters, EventItem } from "../types"

export function useEvents(filters?: EventFilters) {
  return useQuery<EventItem[]>({
   queryKey: ["events", filters?.search, filters?.type, filters?.dateFrom, filters?.dateTo],
    queryFn: () => getEvents(filters),
  })
}