"use client";

import { useEvents } from "@/features/events/hooks/useEvents";
import { useFilters } from "../../../features/filters/context/FiltersContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/features/events/components/EventCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "../../../features/events/components/EventForm";
import { useState } from "react";

export default function DashboardPage() {
  const { filters } = useFilters();
  const { data: events, isLoading } = useEvents(filters);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button aria-label="come-back" variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Volver</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-slate-900">
                Gestión de Eventos
              </h1>
            </div>

            {/* Botón para abrir el futuro formulario de creación */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button aria-label="new-event" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Evento</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Evento</DialogTitle>
                </DialogHeader>

                {/* Le pasamos onSuccess para que cierre el modal al terminar */}
                <EventForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-center text-slate-500">Cargando eventos...</p>
        ) : events?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">
                No has creado ningún evento todavía.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
