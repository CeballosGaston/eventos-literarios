"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, signUp } from "../services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabaseClient";
import { LoginInput, RegisterInput } from "../schemas/authSchema";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const login = useMutation({
    mutationFn: ({ email, password }: LoginInput) => signIn(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      toast.success("¡Bienvenido!");
      router.push("/");
      router.refresh();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(message);
    },
  });

  const register = useMutation({
    mutationFn: ({ email, password }: RegisterInput) => signUp(email, password),
    onSuccess: async () => {
      await supabase.auth.signOut();
      queryClient.clear();
      toast.success("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Error en el registro";
      toast.error(message);
    },
  });

  const logout = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);

      queryClient.removeQueries();
      toast.success("Sesión cerrada");
      router.push("/login");
      router.refresh();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Error al cerrar sesión";
      toast.error(message);
    },
  });

  return { login, register, logout };
}
