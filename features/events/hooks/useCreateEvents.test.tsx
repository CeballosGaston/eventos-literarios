import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCreateEvent, useUpdateEvent } from "./useCreateEvent";
import { supabase } from "@/shared/lib/supabaseClient";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { User, UserResponse } from "@supabase/supabase-js";
import { EventItem } from "../types";

// Mocks
vi.mock("@/shared/lib/supabaseClient", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
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
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestWrapper.displayName = "QueryClientWrapper";
  return TestWrapper;
};

describe("Events Mutations Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Given an authenticated user is logged into platform and a valid set of event details (title, dates, location) is provided).
  // When the user attempts to create the new event.
  // Then the system should save the event in the database associated with the user's ID

  describe("useCreateEvent", () => {
    it("should create an event successfully", async () => {
      const mockUser = { id: "user-123" } as User;

      type CreateEventInput = Omit<
        EventItem,
        "id" | "created_at" | "created_by"
      >;

      const newEvent: CreateEventInput = {
        title: "Feria del Libro",
        location_name: "Madrid",
        type: "taller",
        description: "",
        start_date: "2026-04-29T10:00",
        end_date: "2026-04-29T12:00",
        latitude: 0,
        longitude: 0,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as UserResponse);

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          data: [{ id: "event-1", ...newEvent }],
          error: null,
        }),
      } as unknown as ReturnType<typeof supabase.from>);

      const { result } = renderHook(() => useCreateEvent(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newEvent);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(toast.success).toHaveBeenCalledWith("¡Evento creado!");
    });

    // Given a guest user who is not logged into the system.
    // When an attempt is made to create a new event.
    // Then the system should block the operation and throw an authentication error.

    it("should show error toast if user is not logged in", async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      } as unknown as UserResponse);

      const { result } = renderHook(() => useCreateEvent(), {
        wrapper: createWrapper(),
      });

      type CreateEventInput = Omit<
        EventItem,
        "id" | "created_at" | "created_by"
      >;

      result.current.mutate({ title: "Test" } as unknown as CreateEventInput);

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(toast.error).toHaveBeenCalledWith(
        "Error al crear",
        expect.any(Object),
      );
    });
  });

  // Given an existing event already stored in the database and the user provides updated information for specific fields (e.g., a new title).
  // When the user submits the changes using the event's unique ID.
  // Then the system should update only the modified fields in the database.

  describe("useUpdateEvent", () => {
    it("should update an event successfully", async () => {
      const updatedData = { id: "evt-1", title: "Título Editado" };

      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedData, error: null }),
      } as unknown as ReturnType<typeof supabase.from>);

      const { result } = renderHook(() => useUpdateEvent(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updatedData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(supabase.from).toHaveBeenCalledWith("events");
    });
  });
});
