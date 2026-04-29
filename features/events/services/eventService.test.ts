import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEvents } from "./eventService";
import { PostgrestError } from "@supabase/supabase-js";

interface MockSupabaseResponse {
  data: Record<string, unknown>[] | null;
  error: PostgrestError | null;
}

const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
 
  then: vi.fn().mockImplementation((onFulfilled: (value: MockSupabaseResponse) => void) => {
    return Promise.resolve(onFulfilled({ data: null, error: null }));
  }),
};

vi.mock("@/shared/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => mockQueryBuilder),
  },
}));

describe("getEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

 
  const mockDbResponse = (
    data: Record<string, unknown>[] | null, 
    error: PostgrestError | Error | null = null
  ): void => {
    mockQueryBuilder.then.mockImplementation((onFulfilled: (value: MockSupabaseResponse) => void) => {
     
      return Promise.resolve(onFulfilled({ data, error: error as PostgrestError }));
    });
  };

  it("returns data when no filters are applied", async () => {
    mockDbResponse([{ id: 1, start_date: "2026-05-10" }]);

    const result = await getEvents();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("applies search filter", async () => {
    mockDbResponse([]);

    await getEvents({ search: "test" });

    expect(mockQueryBuilder.ilike).toHaveBeenCalledWith("title", "%test%");
  });

  it("applies type filter", async () => {
    mockDbResponse([]);

    await getEvents({ type: "charla" });

    expect(mockQueryBuilder.eq).toHaveBeenCalledWith("type", "charla");
  });

  it("returns empty array when no data", async () => {
    mockDbResponse(null);

    const result = await getEvents();

    expect(result).toEqual([]);
  });

  it("throws error when supabase fails", async () => {
   
    const errorMock = new Error("fail") as unknown as PostgrestError;
    mockDbResponse(null, errorMock);

    await expect(getEvents()).rejects.toThrow("fail");
  });
});