'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { loadMapState, saveMapState, DEFAULT_MAP_STATE } from '../utils/storage';
import { LayerManager } from '../utils/layerManager';
import { MapEventManager, MapEventType, MapEventHandler } from '../utils/mapEvents';
import { Layer, LayerGroup } from '../types/map';

type MapStyle = 'outdoors' | 'satellite' | 'streets';

interface Viewport {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

interface MapContextType {
  map: mapboxgl.Map | null;
  setMap: (map: mapboxgl.Map | null) => void;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  // Layer management
  addLayerGroup: (group: LayerGroup) => void;
  removeLayerGroup: (groupId: string) => void;
  setLayerGroupVisibility: (groupId: string, visible: boolean) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  getLayerGroups: () => LayerGroup[];
  // Event management
  on: (event: MapEventType, handler: MapEventHandler) => void;
  off: (event: MapEventType, handler: MapEventHandler) => void;
  showPopup: (lngLat: [number, number], content: string | HTMLElement) => void;
  hidePopup: () => void;
}

const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  // Only create managers on client side
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const layerManager = useRef<LayerManager | null>(null);
  const eventManager = useRef<MapEventManager | null>(null);
  const isClient = typeof window !== 'undefined';
  
  // Always start with default state for consistent server/client rendering
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_MAP_STATE);
  const [mapStyle, setMapStyle] = useState<MapStyle>(DEFAULT_MAP_STATE.style || 'outdoors');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load stored state after initial render on client side
  useEffect(() => {
    if (!isClient) return;
    
    const storedState = loadMapState();
    if (storedState) {
      setViewport({
        center: storedState.center,
        zoom: storedState.zoom,
        bearing: storedState.bearing,
        pitch: storedState.pitch,
      });
      if (storedState.style) {
        setMapStyle(storedState.style);
      }
    }
  }, []);

  // Save state whenever viewport or style changes
  const saveState = useCallback(() => {
    if (!isClient) return;
    try {
      saveMapState({
        center: viewport.center,
        zoom: viewport.zoom,
        bearing: viewport.bearing,
        pitch: viewport.pitch,
        style: mapStyle,
      });
    } catch (error) {
      console.error('Error saving map state:', error);
    }
  }, [viewport, mapStyle, isClient]);

  useEffect(() => {
    saveState();
  }, [viewport, mapStyle, saveState]);

  // Initialize managers when map is ready
  useEffect(() => {
    if (!isClient || !map || !isLoaded) return;

    try {
      // Clean up existing managers if they exist
      layerManager.current?.clear();
      eventManager.current?.cleanup();

      // Create new managers
      layerManager.current = new LayerManager(map);
      eventManager.current = new MapEventManager(map);
    } catch (error) {
      console.error('Error initializing map managers:', error);
    }

    return () => {
      try {
        layerManager.current?.clear();
        eventManager.current?.cleanup();
      } catch (error) {
        console.error('Error cleaning up map managers:', error);
      }
    };
  }, [map, isLoaded, isClient]);

  // Layer management methods with error handling
  const addLayerGroup = useCallback((group: LayerGroup) => {
    try {
      if (!layerManager.current) return;
      layerManager.current.addLayerGroup(group);
    } catch (error) {
      console.error('Error adding layer group:', error);
    }
  }, []);

  const removeLayerGroup = useCallback((groupId: string) => {
    try {
      if (!layerManager.current) return;
      layerManager.current.removeLayerGroup(groupId);
    } catch (error) {
      console.error('Error removing layer group:', error);
    }
  }, []);

  const setLayerGroupVisibility = useCallback((groupId: string, visible: boolean) => {
    try {
      if (!layerManager.current) return;
      layerManager.current.setLayerGroupVisibility(groupId, visible);
    } catch (error) {
      console.error('Error setting layer group visibility:', error);
    }
  }, []);

  const setLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    try {
      if (!layerManager.current) return;
      layerManager.current.setLayerVisibility(layerId, visible);
    } catch (error) {
      console.error('Error setting layer visibility:', error);
    }
  }, []);

  const getLayerGroups = useCallback(() => {
    try {
      return layerManager.current?.getLayerGroups() || [];
    } catch (error) {
      console.error('Error getting layer groups:', error);
      return [];
    }
  }, []);

  // Event management methods with error handling
  const on = useCallback((event: MapEventType, handler: MapEventHandler) => {
    try {
      if (!eventManager.current) return;
      eventManager.current.on(event, handler);
    } catch (error) {
      console.error('Error adding event handler:', error);
    }
  }, []);

  const off = useCallback((event: MapEventType, handler: MapEventHandler) => {
    try {
      if (!eventManager.current) return;
      eventManager.current.off(event, handler);
    } catch (error) {
      console.error('Error removing event handler:', error);
    }
  }, []);

  const showPopup = useCallback((lngLat: [number, number], content: string | HTMLElement) => {
    try {
      if (!eventManager.current) return;
      eventManager.current.showPopup(lngLat, content);
    } catch (error) {
      console.error('Error showing popup:', error);
    }
  }, []);

  const hidePopup = useCallback(() => {
    try {
      if (!eventManager.current) return;
      eventManager.current.hidePopup();
    } catch (error) {
      console.error('Error hiding popup:', error);
    }
  }, []);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        viewport,
        setViewport,
        mapStyle,
        setMapStyle,
        isLoaded,
        setIsLoaded,
        addLayerGroup,
        removeLayerGroup,
        setLayerGroupVisibility,
        setLayerVisibility,
        getLayerGroups,
        on,
        off,
        showPopup,
        hidePopup,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
