import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabaseClient";
import { toast } from "sonner";
import { EventItem } from "../types";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: Omit<EventItem, "id" | "created_at" | "created_by">) => {
      
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Debes estar logueado para crear eventos");

    
      const { data, error } = await supabase
        .from("events")
        .insert([
          { 
            ...newEvent, 
            created_by: user.id 
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("¡Evento creado!");
    },
    onError: (error) => {
      toast.error("Error al crear", { description: error.message });
    },
  });
}