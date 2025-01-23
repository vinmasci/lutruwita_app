'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, ToggleButton, ToggleButtonGroup, CircularProgress } from '@mui/material';
import { useMap } from '../contexts/MapContext';

// Initialize mapbox with token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type MapStyle = 'outdoors' | 'satellite' | 'streets';

const MAP_STYLES: Record<MapStyle, string> = {
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  streets: 'mapbox://styles/mapbox/streets-v12',
};

export interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps): JSX.Element {
  const { viewport, setViewport, mapStyle, setMapStyle } = useMap();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleError = (e: mapboxgl.ErrorEvent | Error | string): void => {
    console.error('Map error:', e);
    const message = typeof e === 'string' ? e 
      : e instanceof Error ? e.message 
      : e.error?.message || 'An error occurred loading the map';
    setError(message);
    setIsLoading(false);
  };

  const handleMoveEnd = (e: mapboxgl.MapboxEvent): void => {
    const map = e.target as mapboxgl.Map;
    if (!map) return;
    
    const center = map.getCenter().toArray() as [number, number];
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();
    
    if (
      Math.abs(center[0] - viewport.center[0]) > 0.000001 ||
      Math.abs(center[1] - viewport.center[1]) > 0.000001 ||
      Math.abs(zoom - viewport.zoom) > 0.01 ||
      Math.abs(bearing - viewport.bearing) > 0.1 ||
      Math.abs(pitch - viewport.pitch) > 0.1
    ) {
      setViewport({ center, zoom, bearing, pitch });
    }
  };

  const setupMapLayers = (): void => {
    const map = mapInstance.current;
    if (!map) return;

    try {
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      }

      if (!map.getLayer('3d-buildings')) {
        map.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': .6
          }
        }, 'road-label');
      }

      if (!map.getLayer('poi-labels')) {
        map.addLayer({
          id: 'poi-labels',
          type: 'symbol',
          source: 'composite',
          'source-layer': 'poi_label',
          minzoom: 13,
          filter: ['==', ['get', 'type'], 'Park'],
          layout: {
            'text-field': ['get', 'name'],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
            'text-size': 12,
            'text-max-width': 8,
            'symbol-sort-key': ['get', 'localrank']
          },
          paint: {
            'text-color': '#2d4f28',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });
      }
    } catch (error) {
      console.error('Error setting up map layers:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current || mapInstance.current) {
      return;
    }

    const initializeMap = () => {
      const container = mapContainer.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      console.log('Map container dimensions:', { width: containerWidth, height: containerHeight });
      
      if (containerWidth === 0 || containerHeight === 0) {
        setError('Map container must have dimensions');
        setIsLoading(false);
        return;
      }

      try {
        const initialStyle = MAP_STYLES[mapStyle];
        const map = new mapboxgl.Map({
          container: container,
          style: initialStyle,
          center: viewport.center,
          zoom: viewport.zoom,
          attributionControl: true,
          preserveDrawingBuffer: true,
          maxZoom: 18,
          pitch: 45,
          bearing: 0,
          antialias: true,
          maxTileCacheSize: 50,
          localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
          fadeDuration: 100,
          crossSourceCollisions: true,
          failIfMajorPerformanceCaveat: true
        });

        map.on('error', handleError);
        mapInstance.current = map;

        const handleResize = () => map.resize();
        window.addEventListener('resize', handleResize);

        map.once('style.load', () => {
          map.on('error', handleError);
          map.on('moveend', handleMoveEnd);
          setupMapLayers();
          map.resize();
          setIsLoading(false);
        });

        return () => {
          window.removeEventListener('resize', handleResize);
          if (mapInstance.current) {
            mapInstance.current.off('error', handleError);
            mapInstance.current.off('moveend', handleMoveEnd);
            mapInstance.current.remove();
            mapInstance.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing map:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize map');
        setIsLoading(false);
      }
    };

    requestAnimationFrame(initializeMap);
  }, [mapStyle, viewport]);

  const handleStyleChange = (_: React.MouseEvent<HTMLElement>, newStyle: MapStyle | null): void => {
    if (newStyle !== null) {
      setMapStyle(newStyle);
    }
  };

  if (error) {
    return (
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper'
        }}
      >
        <div>Error: {error}</div>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            zIndex: 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          '& .MuiToggleButton-root': {
            padding: '4px 8px',
            textTransform: 'capitalize',
          },
        }}
      >
        <ToggleButtonGroup
          value={mapStyle}
          exclusive
          onChange={handleStyleChange}
          size="small"
        >
          <ToggleButton value="outdoors">Outdoors</ToggleButton>
          <ToggleButton value="satellite">Satellite</ToggleButton>
          <ToggleButton value="streets">Streets</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        ref={mapContainer}
        className={`w-full h-full ${className || ''}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          '& .mapboxgl-canvas': {
            outline: 'none'
          },
          '& .mapboxgl-ctrl-top-right': {
            top: '60px'
          }
        }}
      />
    </Box>
  );
}
