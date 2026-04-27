import { render, screen, renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { ReactNode } from "react"; // Importamos React para el JSX
import { FiltersProvider, useFilters } from "./FiltersContext";
import { EventFilters } from "@/features/events/types";

// Definimos el tipo para el wrapper
interface WrapperProps {
  children: ReactNode;
}

describe("FiltersContext", () => {
  it("provides default filters", () => {
    // Definimos el wrapper con tipado explícito
    const wrapper = ({ children }: WrapperProps) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(result.current.filters).toEqual({});
  });

  it("updates filters when setFilters is called", () => {
    const wrapper = ({ children }: WrapperProps) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useFilters(), { wrapper });

    const newFilters: EventFilters = { search: "Concierto", type: "taller" };

    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
  });

  it("throws error when used outside of FiltersProvider", () => {
    // Evitamos que el error ensucie la consola del test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Al no pasarle el wrapper, useFilters() lanzará el error definido en tu código
    expect(() => renderHook(() => useFilters())).toThrow(
      "useFilters must be used within FiltersProvider"
    );

    consoleSpy.mockRestore();
  });

  it("renders children correctly", () => {
    render(
      <FiltersProvider>
        <div data-testid="child">Test Child</div>
      </FiltersProvider>
    );

    expect(screen.getByTestId("child")).toBeTruthy();
    expect(screen.getByText("Test Child")).toBeTruthy();
  });
});