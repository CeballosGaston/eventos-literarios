import { supabase } from "@/shared/lib/supabaseClient";
import { EventItem } from "../types";


export async function getEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase.from("events").select("*");

  if (error) throw error;
  return data;
}
