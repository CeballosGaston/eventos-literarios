import { supabase } from "@/shared/lib/supabaseClient";
import { EventFilters } from "../types";

export async function getEvents(filters?: EventFilters) {
  
  let query = supabase.from("events").select("*");
  const from = filters?.dateFrom;
const to = filters?.dateTo;

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

if (from && to) {
  query = query
    .lte("start_date", to + "T23:59:59Z")
    .gte("start_date", from + "T00:00:00Z");
} else if (from) {
  query = query.gte("start_date", from + "T00:00:00Z");
} else if (to) {
  query = query.lte("start_date", to + "T23:59:59Z");
}

 
  const { data, error } = await query;
  

  if (error) throw error;
  return data;
}