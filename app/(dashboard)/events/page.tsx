"use client";

import { useEvents } from "@/features/events/hooks/useEvents";
import { useFilters } from "../../../features/filters/context/FiltersContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, Pencil, Trash2, MapPin } from "lucide-react"; // Iconos para dar vida a la info

export default function DashboardPage() {
  const { filters } = useFilters();
  const { data: events } = useEvents(filters);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Volver al Workspace</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestión de Eventos
            </h1>
          </div>
        </div>
      </header>

      {/* Contenido Principal con Margen Superior y Lateral */}
      <main className="container mx-auto px-4 py-8">
        {/* Estado vacío: Si no hay eventos */}
        {events?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">
                No has creado ningún evento todavía.
              </p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                Crear tu primer evento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl font-bold text-slate-800 leading-tight">
                      {event.title}
                    </CardTitle>
                    <span className="px-2 py-1 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 uppercase shrink-0">
                      {event.type || "Evento"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-4 text-sm text-slate-600 flex-grow">
                  {/* Descripción */}
                  {event.description && (
                    <p className="line-clamp-2 text-slate-500 italic">
                      {event.description}
                    </p>
                  )}

                  {/* Fecha */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {new Date(event.start_date).toLocaleDateString()}
                      {event.end_date &&
                        ` - ${new Date(event.end_date).toLocaleDateString()}`}
                    </span>
                  </div>

                  {/* Ubicación */}
                  {event.location_name && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{event.location_name}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingEvent(event)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}