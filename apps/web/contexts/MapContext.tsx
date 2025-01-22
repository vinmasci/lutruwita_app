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
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
}

const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const isClient = typeof window !== 'undefined';
  
  // Initialize state with defaults
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_MAP_STATE);
  const [mapStyle, setMapStyle] = useState<MapStyle>(DEFAULT_MAP_STATE.style || 'outdoors');

  // Load stored state on client-side mount
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
  }, [isClient]);

  // Save state on changes
  useEffect(() => {
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

  return (
    <MapContext.Provider value={{ viewport, setViewport, mapStyle, setMapStyle }}>
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
