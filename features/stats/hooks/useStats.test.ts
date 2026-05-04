import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import { useStats } from "./useStats";
import { useEvents } from "../../events/hooks/useEvents";
import { EventItem } from "../../events/types";

vi.mock("../../events/hooks/useEvents", () => ({
  useEvents: vi.fn(),
}));

const useEventsMock = useEvents as MockedFunction<typeof useEvents>;

describe("useStats Hook - Full Coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe cubrir el caso de carga inicial", () => {
    useEventsMock.mockReturnValue({
      data: [],
      isLoading: true,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEvents>);

    const { result } = renderHook(() => useStats());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.totalEvents).toBe(0);
  });

  it("debe cubrir todas las ramas de procesamiento de datos", () => {
    const mockEvents: Partial<EventItem>[] = [
      { id: "1", type: "taller", start_date: "2024-01-10" },

      { id: "2", type: "taller", start_date: "2024-01-20" },

      { id: "3", type: "presentacion", start_date: "2024-02-15" },

      { id: "4", start_date: "2024-03-01" },
    ];

    useEventsMock.mockReturnValue({
      data: mockEvents as EventItem[],
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEvents>);

    const { result } = renderHook(() => useStats());

    expect(result.current.totalEvents).toBe(4);

    expect(result.current.categoryData).toHaveLength(3);

    const taller = result.current.categoryData.find((c) => c.name === "taller");
    expect(taller?.value).toBe(2);
    expect(taller?.fill).toBeDefined();

    const otro = result.current.categoryData.find((c) => c.name === "otro");
    expect(otro?.value).toBe(1);

    expect(result.current.monthlyData).toHaveLength(3);

    const ene = result.current.monthlyData.find((m) =>
      m.name.toLowerCase().includes("ene"),
    );
    expect(ene?.cantidad).toBe(2);
  });

  it("debe manejar correctamente el ciclo de colores (modulo)", () => {
    const manyEvents = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      type: `Cat-${i}`,
      start_date: "2024-01-01",
    }));

    useEventsMock.mockReturnValue({
      data: manyEvents as EventItem[],
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEvents>);

    const { result } = renderHook(() => useStats());

    expect(result.current.categoryData[5].fill).toBe(
      result.current.categoryData[0].fill,
    );
  });
});
