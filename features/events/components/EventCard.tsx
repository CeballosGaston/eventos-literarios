"use client";
import { useState } from "react";
import { Calendar, MapPin, Pencil, Trash2, Clock } from "lucide-react";
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUser } from "@/features/auth/hooks/useUser";
import { useDeleteEvent } from "../hooks/useDeleteEvent";
import { EventItem } from "../types";
import {EventForm} from"../components/EventForm";

interface EventCardProps {
  event: EventItem; 
}

export function EventCard({ event }: EventCardProps) {
  const { data: currentUser } = useUser();
  const deleteEventMutation = useDeleteEvent();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const isOwner = currentUser?.id === event.created_by;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
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
        {event.description && (
          <p className="line-clamp-2 text-slate-500 italic">
            {event.description}
          </p>
        )}
        <div className="flex items-start gap-2 text-slate-700">
  <Calendar className="w-4 h-4 mt-1 text-indigo-600" />
  <div className="flex flex-col">
    {/* Fecha Principal */}
    <span className="font-semibold text-sm">
      {new Date(event.start_date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })}
    </span>
    
    {/* Rango de Horas */}
    <span className="text-xs text-slate-500 flex items-center gap-1">
      <Clock className="w-3 h-3" /> {/* Necesitarás importar Clock de lucide-react */}
      {new Date(event.start_date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}
      {" - "}
      {new Date(event.end_date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}
    </span>
  </div>
</div>
        {event.location_name && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{event.location_name}</span>
          </div>
        )}
      </CardContent>

      {isOwner && (
        <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end gap-2 mt-auto">
          {/* Botón Editar (Lógica que haremos luego) */}



      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Pencil className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Evento</DialogTitle>
              </DialogHeader>
              
              {/* Le pasamos el evento actual y la función para cerrar el modal */}
              <EventForm 
                initialData={event} 
                onSuccess={() => setIsEditDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>

         
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8 w-8 p-0"
                disabled={deleteEventMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El evento {event.title} se borrará permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteEventMutation.mutate(event.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirmar eliminación
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}