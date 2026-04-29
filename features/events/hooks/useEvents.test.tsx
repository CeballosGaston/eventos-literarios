import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useEvents } from "./useEvents";
import { getEvents } from "../services/eventService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { EventItem } from "../types";


/**
 * Feature: Event List Hook
 * As a user
 * I want to see all available literary events
 * So that I can choose which one to attend
 *
 * Scenario: Successfully fetch events
 * Given the event service returns a list of events
 * When the useEvents hook is rendered
 * Then it should call the service and return the events data
 */

// 1. Mock
vi.mock("../services/eventService", () => ({
  getEvents: vi.fn(),
}));

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
  Wrapper.displayName = "QueryClientWrapper";

  return Wrapper;
};

describe("useEvents Hook", () => {
  it("should return a list of events", async () => {
    const mockEvents: EventItem[] = [
      {
        id: "1",
        title: "Presentación de libro",
        created_at: "1",
        description: "El Aleph",
        start_date: "1",
        end_date: "2",
        location_name: "Librería",
        latitude: 1,
        longitude: 2,
        created_by: "Poe",
        type: "otro",
      },
    ];
    vi.mocked(getEvents).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockEvents);
  });
});
