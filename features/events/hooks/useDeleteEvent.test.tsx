import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDeleteEvent } from "./useDeleteEvent"; // Ajusta la ruta
import { supabase } from "@/shared/lib/supabaseClient";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

// Mocks
vi.mock("@/shared/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = "QueryClientWrapper";
  return TestWrapper;
};

describe("useDeleteEvent Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete an event successfully", async () => {
    // GIVEN: An existing event ID
    const eventId = "event-to-delete-123";

    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    } as unknown as ReturnType<typeof supabase.from>);

    // WHEN: The delete mutation is triggered
    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(eventId);

    // THEN: It should call supabase, show success toast, and invalidate queries
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(supabase.from).toHaveBeenCalledWith("events");
    expect(toast.success).toHaveBeenCalledWith(
      "Evento eliminado correctamente",
      expect.objectContaining({
        description: "Tu panel de eventos ha sido actualizado",
      })
    );
  });

  it("should show error toast when deletion fails", async () => {
    // GIVEN: A database error during deletion
    const eventId = "failed-event-id";
    const mockError = { message: "Database error occurred" };

    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: mockError }),
    } as unknown as ReturnType<typeof supabase.from>);

    // WHEN: The delete mutation is triggered
    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(eventId);

    // THEN: It should fail and show an error toast
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      "No se pudo eliminar el evento",
      expect.objectContaining({
        description: mockError.message,
      })
    );
  });
});