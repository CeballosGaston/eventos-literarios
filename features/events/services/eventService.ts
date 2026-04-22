import { supabase } from "@/shared/lib/supabaseClient";


export async function getEvents(filters?: {
  type?: string
  date?: string
  zone?: string
}) {
  let query = supabase.from("events").select("*")

  if (filters?.type) {
    query = query.eq("type", filters.type)
  }

  if (filters?.date) {
    query = query.eq("date", filters.date)
  }

  if (filters?.zone) {
    query = query.eq("zone", filters.zone)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}
