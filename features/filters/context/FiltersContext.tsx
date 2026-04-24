"use client";

import { createContext, useContext, useState } from "react";
import { EventFilters } from "@/features/events/types";

type FiltersContextType = {
  filters: EventFilters;
  setFilters: React.Dispatch<React.SetStateAction<EventFilters>>;
};

const FiltersContext = createContext<FiltersContextType | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<EventFilters>({});

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context)
    throw new Error("useFilters must be used within FiltersProvider");
  return context;
}
