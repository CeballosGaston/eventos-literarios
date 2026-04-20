import { supabase } from "@/shared/lib/supabaseClient"

export async function getEvents() {
  const { data, error } = await supabase.from("events").select("*")

  if (error) throw error
  return data
}