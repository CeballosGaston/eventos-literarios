import { supabase } from "@/shared/lib/supabaseClient";
import { EventFilters } from "../types";

export async function getEvents(filters?: EventFilters) {
  let query = supabase.from("events").select("*");

  
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  
  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  
  const { data, error } = await query;

  if (error) throw error;
  if (!data) return [];

  
  const from = filters?.dateFrom;
  const to = filters?.dateTo;

  if (!from && !to) return data;

  return data.filter((event) => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date || event.start_date);

    const fromDate = from ? new Date(from + "T00:00:00") : null;
    const toDate = to ? new Date(to + "T23:59:59") : null;

   
    if (fromDate && toDate) {
      return start <= toDate && end >= fromDate;
    }

   
    if (fromDate) {
      return end >= fromDate;
    }

    
    if (toDate) {
      return start <= toDate;
    }

    return true;
  });
}