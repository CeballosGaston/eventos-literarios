"use client";

import { EventFilters } from "@/features/events/types";

export function EventSidebar({
  filters,
  setFilters,
}: {
  filters: EventFilters;
  setFilters: React.Dispatch<React.SetStateAction<EventFilters>>;
}) {
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
        <select className="p-2 rounded-md border border-slate-200 text-sm">
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
          className="p-2 rounded-md border border-slate-200 text-sm"
        />
        <input
          type="date"
          className="p-2 rounded-md border border-slate-200 text-sm"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2">
        <button className="bg-slate-900 text-white p-2 rounded-md text-sm">
          Ir a eventos
        </button>
        <button className="bg-sky-500 text-white p-2 rounded-md text-sm hover:bg-sky-600 transition">
          Ver estadísticas
        </button>
      </div>
    </aside>
  );
}
