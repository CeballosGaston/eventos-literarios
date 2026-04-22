import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { signIn, signUp } from "../services/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";

// Feature: useAuth Hook
//   As a developer
//   I want to manage authentication UI states (login, register, logout)
//   So that the user gets feedback (toasts) and is redirected correctly

// 1. Mocks

vi.mock("@/shared/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));

vi.mock("../services/authService");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// 2. Wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe("useAuth Hook Unit Tests", () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      replace: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);
  });

  /**
   * Scenario: Successful Login
   * Given valid user credentials
   * When the login mutation is executed and succeeds
   * Then it should save the user in the cache, show a welcome toast, and redirect to home
   */
  it("should login and redirect to home on success", async () => {
    // Given
    const mockUser = { id: "123", email: "test@test.com" } as User;
    const mockSession = { access_token: "fake-token" } as Session;
    vi.mocked(signIn).mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });

    // When
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    result.current.login.mutate({
      email: "test@test.com",
      password: "password123",
    });

    // Then
    await waitFor(() => expect(result.current.login.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("¡Bienvenido!");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  /**
   * Scenario: Successful Logout
   * Given an active session
   * When the logout mutation is executed
   * Then it should clear user data, show toast and redirect to login
   */
  it("should logout and redirect to login on success", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.logout.mutate();

    await waitFor(() => expect(result.current.logout.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Sesión cerrada");
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  /**
   * Scenario: Failed Login
   * Given invalid credentials
   * When the login mutation fails
   * Then it should show an error toast with the message
   */
  it("should show error toast when login fails", async () => {
    const errorMessage = "Credenciales inválidas";
    vi.mocked(signIn).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.login.mutate({
      email: "wrong@test.com",
      password: "wrong-password",
    });

    await waitFor(() => expect(result.current.login.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  /**
   * Scenario: Generic error in registration
   * When the register mutation throws a non-Error object
   * Then it should show a default error message
   */
  it("should show default message when register fails with unknown error", async () => {
    // Simulamos un error que no es instancia de Error
    vi.mocked(signUp).mockRejectedValue("Error fatal");

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    result.current.register.mutate({
      email: "test@test.com",
      password: "password123",
      confirmPassword: "password123",
    });

    await waitFor(() => expect(result.current.register.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith("Error en el registro");
  });

  /**
   * Scenario: Successful Registration
   * Given new user data
   * When the register mutation is executed and succeeds
   * Then it should sign out (to prevent auto-login), clear cache, show a toast, and redirect to login
   */
  it("should register and redirect to login on success", async () => {
    // Given
    const mockUser = { id: "123", email: "new@test.com" } as User;
    vi.mocked(signUp).mockResolvedValue({
      user: mockUser,
      session: {} as Session,
    });

    // When
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    result.current.register.mutate({
      email: "new@test.com",
      password: "password123",
      confirmPassword: "password123",
    });

    // Then
    await waitFor(() => expect(result.current.register.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining("Cuenta creada"),
    );
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
