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
  query = query.or(
    `and(start_date.lte.${to}T23:59:59Z,coalesce(end_date,start_date).gte.${from}T00:00:00Z)`
  );
}

 
  const { data, error } = await query;
  

  if (error) throw error;
  return data;
}