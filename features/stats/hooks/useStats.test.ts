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
    // Escenario diseñado para tocar cada línea del hook:
    const mockEvents: Partial<EventItem>[] = [
      // Rama 1: Nueva categoría + Rama meses
      { id: "1", type: "taller", start_date: "2024-01-10" },
      // Rama 2: Categoría existente (incremento) + Mismo mes
      { id: "2", type: "taller", start_date: "2024-01-20" },
      // Rama 3: Nueva categoría (para probar el ciclo de colores)
      { id: "3", type: "presentacion", start_date: "2024-02-15" },
      // Rama 4: Fallback "otro" (cuando type es undefined o null)
      { id: "4", start_date: "2024-03-01" },
    ];

    useEventsMock.mockReturnValue({
      data: mockEvents as EventItem[],
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEvents>);

    const { result } = renderHook(() => useStats());

    // 1. Verificar total
    expect(result.current.totalEvents).toBe(4);

    // 2. Verificar Categorías (Cubre: creación, incremento y fallback "otro")
    expect(result.current.categoryData).toHaveLength(3); // taller, presentacion, otro

    const taller = result.current.categoryData.find((c) => c.name === "taller");
    expect(taller?.value).toBe(2); // Incremento verificado
    expect(taller?.fill).toBeDefined(); // Asignación de color verificada

    const otro = result.current.categoryData.find((c) => c.name === "otro");
    expect(otro?.value).toBe(1); // Fallback verificado

    // 3. Verificar Meses (Cubre: creación e incremento de meses)
    expect(result.current.monthlyData).toHaveLength(3); // Ene, Feb, Mar

    const ene = result.current.monthlyData.find((m) =>
      m.name.toLowerCase().includes("ene"),
    );
    expect(ene?.cantidad).toBe(2); // Acumulación mensual verificada
  });

  it("debe manejar correctamente el ciclo de colores (modulo)", () => {
    // Creamos más eventos que colores hay en el array (6 eventos, 5 colores)
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

    // El sexto elemento (índice 5) debe tener el mismo color que el primero (índice 0)
    // debido a la operación acc.length % COLORS.length
    expect(result.current.categoryData[5].fill).toBe(
      result.current.categoryData[0].fill,
    );
  });
});
