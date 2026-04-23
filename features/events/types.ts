export type EventType =
  | "charla"
  | "lectura"
  | "presentacion"
  | "taller"
  | "performance"
  | "debate"
  | "otro";

export type EventFilters = {
  search?: string;
  type?: EventType;
  dateFrom?: string;
  dateTo?: string;
};

export type EventItem = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  created_by: string;
  type: EventType;
};
