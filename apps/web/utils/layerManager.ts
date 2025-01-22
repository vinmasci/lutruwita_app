import mapboxgl from 'mapbox-gl';
import { Layer, LayerGroup, MarkerLayer } from '../types/map';

export class LayerManager {
  private map: mapboxgl.Map;
  private markers: Map<string, mapboxgl.Marker>;
  private layerGroups: Map<string, LayerGroup>;

  constructor(map: mapboxgl.Map) {
    this.map = map;
    this.markers = new Map();
    this.layerGroups = new Map();
  }

  addLayerGroup(group: LayerGroup): void {
    this.layerGroups.set(group.id, group);
    if (group.visible) {
      group.layers.forEach(layer => this.addLayer(layer, group.id));
    }
  }

  removeLayerGroup(groupId: string): void {
    const group = this.layerGroups.get(groupId);
    if (group) {
      group.layers.forEach(layer => this.removeLayer(layer.id));
      this.layerGroups.delete(groupId);
    }
  }

  setLayerGroupVisibility(groupId: string, visible: boolean): void {
    const group = this.layerGroups.get(groupId);
    if (group) {
      group.visible = visible;
      group.layers.forEach(layer => {
        if (visible) {
          this.addLayer(layer, groupId);
        } else {
          this.removeLayer(layer.id);
        }
      });
    }
  }

  addLayer(layer: Layer, groupId: string): void {
    if (!layer.visible) return;

    switch (layer.type) {
      case 'marker':
        this.addMarker(layer);
        break;
      case 'line':
        this.addLine(layer);
        break;
      case 'polygon':
        this.addPolygon(layer);
        break;
      case 'circle':
        this.addCircle(layer);
        break;
    }
  }

  removeLayer(layerId: string): void {
    // Remove marker if exists
    if (this.markers.has(layerId)) {
      this.markers.get(layerId)?.remove();
      this.markers.delete(layerId);
    }

    // Remove mapbox layer if exists
    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }

    // Remove mapbox source if exists
    if (this.map.getSource(layerId)) {
      this.map.removeSource(layerId);
    }
  }

  setLayerVisibility(layerId: string, visible: boolean): void {
    for (const group of this.layerGroups.values()) {
      const layer = group.layers.find(l => l.id === layerId);
      if (layer) {
        layer.visible = visible;
        if (visible) {
          this.addLayer(layer, group.id);
        } else {
          this.removeLayer(layerId);
        }
        break;
      }
    }
  }

  private addMarker(layer: MarkerLayer): void {
    const marker = new mapboxgl.Marker({
      color: layer.color || '#FF0000',
    })
      .setLngLat(layer.coordinates)
      .addTo(this.map);

    this.markers.set(layer.id, marker);
  }

  private addLine(layer: Layer & { type: 'line' }): void {
    this.map.addSource(layer.id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: layer.coordinates,
        },
      },
    });

    this.map.addLayer({
      id: layer.id,
      type: 'line',
      source: layer.id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': layer.color || '#000',
        'line-width': layer.width || 2,
        'line-opacity': layer.opacity || 1,
      },
    });
  }

  private addPolygon(layer: Layer & { type: 'polygon' }): void {
    this.map.addSource(layer.id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: layer.coordinates,
        },
      },
    });

    this.map.addLayer({
      id: layer.id,
      type: 'fill',
      source: layer.id,
      paint: {
        'fill-color': layer.fillColor || '#000',
        'fill-opacity': layer.opacity || 0.5,
        'fill-outline-color': layer.outlineColor || '#000',
      },
    });
  }

  private addCircle(layer: Layer & { type: 'circle' }): void {
    this.map.addSource(layer.id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: layer.coordinates,
        },
      },
    });

    this.map.addLayer({
      id: layer.id,
      type: 'circle',
      source: layer.id,
      paint: {
        'circle-radius': layer.radius,
        'circle-color': layer.color || '#000',
        'circle-opacity': layer.opacity || 0.5,
      },
    });
  }

  getLayerGroups(): LayerGroup[] {
    return Array.from(this.layerGroups.values());
  }

  clear(): void {
    // Remove all markers
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();

    // Remove all layers and sources
    this.layerGroups.forEach(group => {
      group.layers.forEach(layer => {
        if (this.map.getLayer(layer.id)) {
          this.map.removeLayer(layer.id);
        }
        if (this.map.getSource(layer.id)) {
          this.map.removeSource(layer.id);
        }
      });
    });

    this.layerGroups.clear();
  }
}
