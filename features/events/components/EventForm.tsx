"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EventItem } from "../types";
import { useCreateEvent, useUpdateEvent } from "../hooks/useCreateEvent";
import { CATEGORIES_OPTIONS } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importarás useUpdateEvent cuando lo hagamos

type EventFormData = Omit<EventItem, "id" | "created_at" | "created_by">;

interface EventFormProps {
  initialData?: EventItem;
  onSuccess: () => void;
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
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

  const startDateValue = useWatch({ control, name: "start_date" });

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
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("Errores:", errors),
      )}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Título del evento</Label>
        <Input
          id="title"
          {...register("title", { required: "El título es obligatorio" })}
        />
        {errors.title && (
          <p className="text-xs text-red-500">
            {errors.title.message as string}
          </p>
        )}
      </div>

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
        {errors.type && (
          <p className="text-xs text-red-500">
            {errors.type.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Fecha de comienzo</Label>
          <Input
            id="start_date"
            type="datetime-local"
            {...register("start_date", {
              required: "La fecha de inicio es obligatoria",
            })}
          />
          {errors.start_date && (
            <p className="text-xs text-red-500">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Fecha de cierre</Label>
          <Input
            id="end_date"
            type="datetime-local"
            {...register("end_date", {
              required: "La fecha de cierre es obligatoria",
              validate: (value) => {
                if (!startDateValue) return true;
                return (
                  new Date(value) > new Date(startDateValue) ||
                  "La fecha de cierre debe ser posterior al inicio"
                );
              },
            })}
          />
          {errors.end_date && (
            <p className="text-xs text-red-500">{errors.end_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_name">Lugar</Label>
          <Input
            id="location_name"
            {...register("location_name", {
              required: "El lugar es obligatorio",
            })}
          />
          {errors.location_name && (
            <p className="text-xs text-red-500">
              {errors.location_name.message}
            </p>
          )}
        </div>
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
