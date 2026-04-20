import { z } from "zod";

// 1. Definimos las piezas básicas (puedes reutilizar estos campos en cualquier parte)
const emailSchema = z.email("Introduce un correo electrónico válido");
const passwordSchema = z.string().min(6, "La contraseña debe tener al menos 6 caracteres");

// 2. Esquema para LOGIN (solo email y password)
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es obligatoria"), // En login no validamos min(6), solo que no esté vacío
});

// 3. Esquema para REGISTER (reutilizamos login y extendemos)
export const registerSchema = loginSchema.extend({
  password: passwordSchema, // Aquí sí aplicamos el mínimo de 6
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Tipos para exportar
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;