import { useState } from "react";

type Params = {
  dateFrom?: string;
  dateTo?: string;
  setFilters: React.Dispatch<
    React.SetStateAction<{
      dateFrom?: string;
      dateTo?: string;
    }>
  >;
};

export function useDateFilterValidation({
  dateFrom,
  dateTo,
  setFilters,
}: Params) {
  const [error, setError] = useState<string | null>(null);

  const setDateFrom = (value: string | undefined) => {
    if (dateTo && value && value > dateTo) {
      setError("La fecha de inicio no puede ser posterior a la de fin");
      return;
    }

    setError(null);

    setFilters((prev) => ({
      ...prev,
      dateFrom: value,
    }));
  };

  const setDateTo = (value: string | undefined) => {
    if (dateFrom && value && value < dateFrom) {
      setError("La fecha de fin no puede ser anterior a la de inicio");
      return;
    }

    setError(null);

    setFilters((prev) => ({
      ...prev,
      dateTo: value,
    }));
  };

  return {
    error,
    setDateFrom,
    setDateTo,
  };
}