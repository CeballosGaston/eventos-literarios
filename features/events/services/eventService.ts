import { supabase } from "@/shared/lib/supabaseClient";
import { EventFilters } from "../types"

export async function getEvents(filters?: EventFilters) {
  let query = supabase.from("events").select("*")

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`)
  }

  if (filters?.type) {
    query = query.eq("type", filters.type)
  }

 if (filters?.dateFrom) {
  query = query.gte("start_date", filters.dateFrom)
}

if (filters?.dateTo) {
  query = query.lte("start_date", filters.dateTo)
}
  const { data, error } = await query

  if (error) throw error
  return data
}
