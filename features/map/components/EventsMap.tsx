"use client";


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { EventItem } from "../../events/types";
import { memo } from "react";



const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface EventsMapProps {
  events: EventItem[];
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (event: EventItem) => void;
  latitude?: number;
  longitude?: number;
}

export const EventsMap = memo(function EventsMap({
  events,
  onMapClick,
  onMarkerClick,
}: EventsMapProps) {
  const center = { lat: 41.3851, lng: 2.1734 };

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        preferCanvas={true}
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventsHandler onMapClick={onMapClick} />

        {events.map(
          (event) =>
            event.latitude &&
            event.longitude && (
              <Marker
                key={event.id}
                position={[event.latitude, event.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onMarkerClick?.(event),
                }}
              >
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm">{event.location_name}</p>
                  </div>
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
});

function MapEventsHandler({
  onMapClick,
}: {
  onMapClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
