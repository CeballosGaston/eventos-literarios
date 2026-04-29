import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUser } from "./useUser";
import { supabase } from "@/shared/lib/supabaseClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import type { User, AuthError } from "@supabase/supabase-js";

vi.mock("@/shared/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
    })),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe("useUser Hook Unit Tests", () => {
  /**
   * Scenario: User is logged in
   * Given a valid session in Supabase
   * When the hook is called
   * Then it should return the user data
   */

  it("should return user data when authenticated", async () => {
    const mockAuthUser = { id: "12-34", email: "test@test.com" } as User;
    const mockDbUser = {
      id: "12-34",
      email: "test@test.com",
      name: "Test User",
    };

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockAuthUser },
      error: null,
    });

    const chainMock = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockDbUser, error: null }),
    };

    vi.mocked(supabase.from).mockReturnValue(
      chainMock as unknown as ReturnType<typeof supabase.from>,
    );

    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.data).toEqual(mockDbUser);
  });
  /**
   * Scenario: No user / Error in Supabase
   * Given an error or no session in Supabase
   * When the hook is called
   * Then it should return null
   */

  it("should return null when not authenticated or error occurs", async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: {
        message: "Auth session missing",
        name: "AuthError",
        status: 400,
      } as AuthError,
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});
