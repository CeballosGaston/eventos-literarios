"use client";

import { useFilters } from "../../../features/filters/context/FiltersContext";
import { EventCategory } from "@/features/events/types";
import Link from "next/link";
import { useDateFilterValidation } from "@/features/filters/hooks/useDateFilterValidation";

export function EventSidebar() {
  const { filters, setFilters } = useFilters();

  const { error, setDateFrom, setDateTo } = useDateFilterValidation({
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    setFilters,
  });

  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col gap-6">
      {/* HEADER */}

      {/* SEARCH */}
      <div className="flex flex-col gap-2">
        <label className="text-m font-bold text-sky-600">Buscar</label>
        <input
          type="text"
          placeholder="Título del evento..."
          className="p-2 rounded-md border border-slate-200 text-sm"
          value={filters?.search || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              search: e.target.value,
            }))
          }
        />
      </div>

      {/* TYPE */}
      <div className="flex flex-col gap-2">
        <label className="text-m font-bold text-sky-600">Categorías</label>
        <select
          className="p-2 rounded text-black"
          value={filters?.type || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              type: (e.target.value || undefined) as EventCategory | undefined,
            }))
          }
        >
          <option value="">Todos</option>
          <option value="charla">Charla</option>
          <option value="lectura">Lectura</option>
          <option value="presentacion">Presentación</option>
          <option value="taller">Taller</option>
          <option value="performance">Performance</option>
          <option value="debate">Debate</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* DATES */}
      <div className="flex flex-col gap-2">
        <label className="text-m font-bold text-sky-600">Fechas</label>
        <input
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) => setDateFrom(e.target.value || undefined)}
        />
        <input
          type="date"
          value={filters.dateTo || ""}
          onChange={(e) => setDateTo(e.target.value || undefined)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2">
        <Link
          href="/events"
          className="bg-slate-900 text-white p-2 rounded-md text-sm block text-center"
        >
          <button>Ir a eventos</button>
        </Link>

        <Link
          href="/stats"
          className="bg-sky-500 text-white p-2 rounded-md text-sm hover:bg-sky-600 transition text-center"
        >
          <button> Ver estadísticas </button>
        </Link>
      </div>
    </aside>
  );
}
