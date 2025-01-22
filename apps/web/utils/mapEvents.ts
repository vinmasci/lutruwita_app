import mapboxgl from 'mapbox-gl';
import { Layer } from '../types/map';

export type MapEventType = 
  | 'click'
  | 'mousemove'
  | 'mouseenter'
  | 'mouseleave'
  | 'dragstart'
  | 'dragend'
  | 'zoom'
  | 'rotate'
  | 'pitch';

export interface MapEventData {
  lngLat: [number, number];
  point: [number, number];
  features?: mapboxgl.MapboxGeoJSONFeature[];
  layer?: Layer;
}

export type MapEventHandler = (data: MapEventData) => void;

export class MapEventManager {
  private map: mapboxgl.Map;
  private handlers: Map<MapEventType, Set<MapEventHandler>>;
  private activePopup: mapboxgl.Popup | null = null;

  constructor(map: mapboxgl.Map) {
    this.map = map;
    this.handlers = new Map();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Click events
    this.map.on('click', (e) => {
      const features = this.map.queryRenderedFeatures(e.point);
      this.emit('click', {
        lngLat: [e.lngLat.lng, e.lngLat.lat],
        point: [e.point.x, e.point.y],
        features,
      });
    });

    // Mouse move events
    this.map.on('mousemove', (e) => {
      const features = this.map.queryRenderedFeatures(e.point);
      this.emit('mousemove', {
        lngLat: [e.lngLat.lng, e.lngLat.lat],
        point: [e.point.x, e.point.y],
        features,
      });
    });

    // Layer hover events
    this.map.on('mouseenter', 'markers', (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      this.emit('mouseenter', {
        lngLat: [e.lngLat.lng, e.lngLat.lat],
        point: [e.point.x, e.point.y],
        features: e.features,
      });
    });

    this.map.on('mouseleave', 'markers', () => {
      this.map.getCanvas().style.cursor = '';
      this.emit('mouseleave', {
        lngLat: [0, 0],
        point: [0, 0],
      });
    });

    // Map movement events
    this.map.on('dragstart', () => this.emit('dragstart', { lngLat: [0, 0], point: [0, 0] }));
    this.map.on('dragend', () => this.emit('dragend', { lngLat: [0, 0], point: [0, 0] }));
    this.map.on('zoom', () => this.emit('zoom', { lngLat: [0, 0], point: [0, 0] }));
    this.map.on('rotate', () => this.emit('rotate', { lngLat: [0, 0], point: [0, 0] }));
    this.map.on('pitch', () => this.emit('pitch', { lngLat: [0, 0], point: [0, 0] }));
  }

  on(event: MapEventType, handler: MapEventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)?.add(handler);
  }

  off(event: MapEventType, handler: MapEventHandler) {
    this.handlers.get(event)?.delete(handler);
  }

  private emit(event: MapEventType, data: MapEventData) {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }

  showPopup(lngLat: [number, number], content: string | HTMLElement) {
    this.activePopup?.remove();
    this.activePopup = new mapboxgl.Popup()
      .setLngLat(lngLat)
      .setDOMContent(typeof content === 'string' ? document.createTextNode(content) : content)
      .addTo(this.map);
  }

  hidePopup() {
    this.activePopup?.remove();
    this.activePopup = null;
  }

  cleanup() {
    this.handlers.clear();
    this.hidePopup();
  }
}
