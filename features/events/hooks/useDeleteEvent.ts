import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabaseClient";
import { toast } from "sonner";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento eliminado correctamente", {
        description: "Tu panel de eventos ha sido actualizado",
      });
    },
    onError: (error) => {
      toast.error("No se pudo eliminar el evento", {
        description: error.message,
      });
    },
  });
}
