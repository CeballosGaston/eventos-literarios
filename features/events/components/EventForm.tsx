"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EventItem, CATEGORIES_OPTIONS } from "../types";
import { useCreateEvent, useUpdateEvent } from "../hooks/useCreateEvent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";



interface PhotonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    country?: string;
    state?: string;
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

interface SearchResult {
  x: number;
  y: number;
  label: string;
}

type EventFormData = Omit<EventItem, "id" | "created_at" | "created_by">;

interface EventFormProps {
  initialData?: EventItem;
  onSuccess: () => void;
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const createMutation = useCreateEvent();
  const { mutate: updateEvent } = useUpdateEvent();

  const isEditing = !!initialData?.id;

  const formatDBDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: initialData
      ? {
          ...initialData,
          start_date: formatDBDateForInput(initialData.start_date),
          end_date: initialData.end_date
            ? formatDBDateForInput(initialData.end_date)
            : "",
        }
      : {
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          location_name: "",
        },
  });



  const handleSearchAddress = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const query = e.target.value;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`,
        );
        const data: PhotonResponse = await response.json();

        if (data.features && data.features.length > 0) {
          const mappedResults: SearchResult[] = data.features.map(
            (f: PhotonFeature) => {
              const p = f.properties;

              const label = p.street
                ? `${p.street}${p.housenumber ? " " + p.housenumber : ""}, ${p.city || ""}`
                : p.name || p.city || "Ubicación encontrada";

              return {
                x: f.geometry.coordinates[0],
                y: f.geometry.coordinates[1],
                label: label,
              };
            },
          );
          setSuggestions(mappedResults);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error crítico:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const selectSuggestion = (sug: SearchResult) => {
    setValue("location_name", sug.label);

    setValue("latitude", sug.y);

    setValue("longitude", sug.x);
    setSuggestions([]);
  };

  const onSubmit = (data: EventFormData) => {
    const formattedData = {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: data.end_date
        ? new Date(data.end_date).toISOString()
        : new Date(data.start_date).toISOString(),
    };
    if (isEditing) {
      updateEvent({ ...formattedData, id: initialData!.id }, { onSuccess });
    } else {
      createMutation.mutate(formattedData, {
        onSuccess: () => onSuccess(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título del evento</Label>
        <Input
          id="title"
          {...register("title", { required: "El título es obligatorio" })}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Controller
          name="type"
          control={control}
          rules={{ required: "La categoría es obligatoria" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Elige un tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Fecha de comienzo</Label>
          <Input
            id="start_date"
            type="datetime-local"
            {...register("start_date", { required: "Obligatorio" })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Fecha de cierre</Label>
          <Input
            id="end_date"
            type="datetime-local"
            {...register("end_date", { required: "Obligatorio" })}
          />
        </div>
      </div>

      {/* LUGAR - El buscador corregido */}
      <div className="space-y-2 relative">
        <Label htmlFor="location_name">Lugar</Label>
        <div className="relative">
          <Input
            id="location_name"
            placeholder="Ej: Carrer de Mallorca, Barcelona"
            {...register("location_name", {
              required: "El lugar es obligatorio",
            })}
            onChange={(e) => {
              register("location_name").onChange(e);
              handleSearchAddress(e);
            }}
            autoComplete="off"
          />

          {/* LISTA DE SUGERENCIAS */}
          {suggestions.length > 0 && (
            <ul
              className="fixed z-[9999] bg-white border-2 border-black shadow-2xl rounded-md max-h-60 overflow-auto w-[var(--input-width)]"
              style={{
                width: "300px",
                backgroundColor: "white",
                color: "black",
              }}
            >
              {suggestions.map((sug, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectSuggestion(sug);
                  }}
                >
                  {sug.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isSearching && (
          <p className="text-[10px] text-slate-400 animate-pulse mt-1">
            Buscando ubicación...
          </p>
        )}
        {errors.location_name && (
          <p className="text-xs text-red-500 mt-1">
            {errors.location_name.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createMutation.isPending}
      >
        {isEditing ? "Guardar cambios" : "Crear Evento"}
      </Button>
    </form>
  );
}
