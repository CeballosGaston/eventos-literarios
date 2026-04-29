import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabaseClient";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) return null;

      const { data, error } = await supabase
        .from("users")
        .select("id, email, name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error; 

     
      return data || { id: user.id, email: user.email, name: "Cargando perfil..." };
    },
    staleTime: 1000 * 60 * 5,
  });
}