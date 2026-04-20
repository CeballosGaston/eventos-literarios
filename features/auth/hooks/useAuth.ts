"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, signUp } from "../services/authService";
import { supabase } from "@/shared/lib/supabaseClient";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

const register = useMutation({
  mutationFn: ({ email, password }: { email: string; password: string }) =>
    signUp(email, password), 
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  },
  
});

  const logout = useMutation({
    mutationFn: signOut,

    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,

    login,
    register,
    logout,
  };
}
