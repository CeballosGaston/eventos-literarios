export type EventCategory =
  | "charla"
  | "lectura"
  | "presentacion"
  | "taller"
  | "performance"
  | "debate"
  | "otro";

export type EventFilters = {
  search?: string;
  type?: EventCategory;
  dateFrom?: string;
  dateTo?: string;
};

export type EventItem = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_name: string;
  latitude: number;
  longitude: number;
  created_by: string;
  type: EventCategory;
};
