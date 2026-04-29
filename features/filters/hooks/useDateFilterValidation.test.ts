import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDateFilterValidation } from "./useDateFilterValidation";

describe("useDateFilterValidation", () => {
  it("allows valid dateFrom update", () => {
    const setFilters = vi.fn();

    const { result } = renderHook(() =>
      useDateFilterValidation({
        dateFrom: undefined,
        dateTo: "2026-05-10",
        setFilters,
      }),
    );

    act(() => {
      result.current.setDateFrom("2026-05-05");
    });

    expect(setFilters).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it("blocks dateFrom when it is after dateTo", () => {
    const setFilters = vi.fn();

    const { result } = renderHook(() =>
      useDateFilterValidation({
        dateFrom: undefined,
        dateTo: "2026-05-10",
        setFilters,
      }),
    );

    act(() => {
      result.current.setDateFrom("2026-05-20");
    });

    expect(setFilters).not.toHaveBeenCalled();
    expect(result.current.error).toBe(
      "La fecha de inicio no puede ser posterior a la de fin",
    );
  });

  it("blocks dateTo when it is before dateFrom", () => {
    const setFilters = vi.fn();

    const { result } = renderHook(() =>
      useDateFilterValidation({
        dateFrom: "2026-05-10",
        dateTo: undefined,
        setFilters,
      }),
    );

    act(() => {
      result.current.setDateTo("2026-05-01");
    });

    expect(setFilters).not.toHaveBeenCalled();
    expect(result.current.error).toBe(
      "La fecha de fin no puede ser anterior a la de inicio",
    );
  });

  it("resets error after fixing invalid input", () => {
    const setFilters = vi.fn();

    const { result } = renderHook(() =>
      useDateFilterValidation({
        dateFrom: undefined,
        dateTo: "2026-05-10",
        setFilters,
      }),
    );

    act(() => {
      result.current.setDateFrom("2026-05-20");
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.setDateFrom("2026-05-05");
    });

    expect(result.current.error).toBeNull();
  });

  it("allows updates when no date constraints exist", () => {
  const setFilters = vi.fn();

  const { result } = renderHook(() =>
    useDateFilterValidation({
      dateFrom: undefined,
      dateTo: undefined,
      setFilters,
    })
  );

  act(() => {
    result.current.setDateFrom("2026-05-01");
  });

  expect(setFilters).toHaveBeenCalled();
  expect(result.current.error).toBeNull();
});

  it("clears error when valid input is given after invalid attempt", () => {
    const setFilters = vi.fn();

    const { result } = renderHook(() =>
      useDateFilterValidation({
        dateFrom: undefined,
        dateTo: "2026-05-10",
        setFilters,
      }),
    );

    act(() => {
      result.current.setDateFrom("2026-05-20");
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.setDateFrom("2026-05-05");
    });

    expect(result.current.error).toBeNull();
    expect(setFilters).toHaveBeenCalledTimes(1);
  });
});
