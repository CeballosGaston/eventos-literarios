"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, signUp } from "../services/authService";
import { toast } from "sonner";

import { LoginInput, RegisterInput } from "../schemas/authSchema";

export function useAuth() {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: ({ email, password }: LoginInput) => signIn(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      toast.success("¡Bienvenido!");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(message);
    },
  });

  const register = useMutation({
    mutationFn: ({ email, password }: RegisterInput) => signUp(email, password),
    onSuccess: () => {
      toast.success("Registro completado. Revisa tu email.");
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
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Error al cerrar sesión";
      toast.error(message);
    },
  });

  return { login, register, logout };
}
