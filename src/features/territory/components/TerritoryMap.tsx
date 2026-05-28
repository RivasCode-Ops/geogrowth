import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Territory } from '@/features/territory/types/territory';
import '@/features/territory/components/territory.css';

type TerritoryMapProps = {
  territories: Territory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const DEFAULT_CENTER: L.LatLngExpression = [-15.78, -47.93];
const DEFAULT_ZOOM = 4;

function boundsToLeaflet(bounds: Territory['bounds']): L.LatLngBoundsExpression {
  return [
    [bounds.south, bounds.west],
    [bounds.north, bounds.east],
  ];
}

export function TerritoryMap({ territories, selectedId, onSelect }: TerritoryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) {
      return;
    }

    layerGroup.clearLayers();

    territories.forEach((territory) => {
      const rect = L.rectangle(boundsToLeaflet(territory.bounds), {
        color: territory.color,
        weight: selectedId === territory.id ? 3 : 2,
        fillOpacity: selectedId === territory.id ? 0.35 : 0.2,
      });
      rect.bindPopup(`<strong>${territory.name}</strong>`);
      rect.on('click', () => onSelect(territory.id));
      rect.addTo(layerGroup);
    });

    if (territories.length > 0) {
      const group = L.featureGroup(layerGroup.getLayers());
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [territories, selectedId, onSelect]);

  return <div ref={containerRef} className="territory-map" aria-label="Mapa de territórios" />;
}
