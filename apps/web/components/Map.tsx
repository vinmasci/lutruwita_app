'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useMap } from '../contexts/MapContext';

// Initialize mapbox with token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type MapStyle = 'outdoors' | 'satellite' | 'streets';

const MAP_STYLES: Record<MapStyle, string> = {
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  streets: 'mapbox://styles/mapbox/streets-v12',
};

interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps) {
  const {
    map,
    setMap,
    viewport,
    setViewport,
    mapStyle,
    setMapStyle,
    isLoaded,
    setIsLoaded
  } = useMap();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  
  // Event handler refs to maintain stable references
  const handleErrorRef = useRef((e: mapboxgl.ErrorEvent) => {
    console.error('Map error:', e);
  });

  const handleStyleDataRef = useRef((e: mapboxgl.MapboxEvent<any, any>) => {
    const map = e.target as mapboxgl.Map;
    if (!map.getStyle()) {
      console.error('Failed to load map style');
    }
  });

  const handleLoadRef = useRef((map: mapboxgl.Map) => {
    if (!map) return;
    setIsLoaded(true);
    setMap(map);
    setMapInstance(map);
    console.log('Map loaded successfully');
  });

  const handleMoveEndRef = useRef((e: mapboxgl.MapboxEvent<any, any>) => {
    const map = e.target as mapboxgl.Map;
    if (!map) return;
    const center = map.getCenter().toArray() as [number, number];
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();
    setViewport({ center, zoom, bearing, pitch });
  });

  // Initialize map on client side only
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current || mapInstance || map) return;

    let mounted = true;
    let newMap: mapboxgl.Map | null = null;

    try {
      // Force cleanup of any existing WebGL contexts
      const canvas = mapContainer.current.querySelector('.mapboxgl-canvas') as HTMLCanvasElement;
      if (canvas) {
        const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) || 
                  canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });
        if (gl && 'getExtension' in gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) {
            ext.loseContext();
          }
        }
      }

      newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[mapStyle],
        center: viewport.center,
        zoom: viewport.zoom,
        attributionControl: true,
        preserveDrawingBuffer: true, // Helps with rendering consistency
        maxZoom: 18
      });

      if (mounted) {
        // Create navigation control
        const navControl = new mapboxgl.NavigationControl();
        
        // Attach event handlers
        newMap.on('error', handleErrorRef.current);
        newMap.on('styledata', handleStyleDataRef.current);
        newMap.once('load', () => handleLoadRef.current(newMap));
        newMap.on('moveend', handleMoveEndRef.current);

        // Add navigation controls
        newMap.addControl(navControl, 'top-right');
      }

      return () => {
        mounted = false;
        if (newMap) {
          try {
            // Remove event listeners
            newMap.off('error', handleErrorRef.current);
            newMap.off('styledata', handleStyleDataRef.current);
            newMap.off('load');
            newMap.off('moveend', handleMoveEndRef.current);
            
            // Clear references before removing the map
            setMap(null);
            setMapInstance(null);
            setIsLoaded(false);
            
            // Remove the map instance
            newMap.remove();
          } catch (error) {
            console.error('Error cleaning up map:', error);
          }
          newMap = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [setMap, setIsLoaded, setViewport, viewport.center, viewport.zoom, mapStyle, map, mapInstance]);

  // Update map when viewport or style changes from context
  useEffect(() => {
    if (!mapInstance || !isLoaded) return;

    try {
      const currentCenter = mapInstance.getCenter().toArray();
      const currentZoom = mapInstance.getZoom();
      const currentStyle = mapInstance.getStyle();
      
      // Only update if values have changed significantly
      const centerChanged = Math.abs(currentCenter[0] - viewport.center[0]) > 0.00001 
        || Math.abs(currentCenter[1] - viewport.center[1]) > 0.00001;
      const zoomChanged = Math.abs(currentZoom - viewport.zoom) > 0.01;
      const styleChanged = currentStyle && MAP_STYLES[mapStyle] !== currentStyle.name;

      if (centerChanged) {
        mapInstance.setCenter(viewport.center);
      }
      if (zoomChanged) {
        mapInstance.setZoom(viewport.zoom);
      }
      if (styleChanged) {
        mapInstance.setStyle(MAP_STYLES[mapStyle]);
      }
      
      mapInstance.setBearing(viewport.bearing);
      mapInstance.setPitch(viewport.pitch);
    } catch (error) {
      console.error('Error updating map:', error);
    }
  }, [mapInstance, viewport, mapStyle, isLoaded]);

  const handleStyleChange = (_: React.MouseEvent<HTMLElement>, newStyle: MapStyle | null) => {
    if (newStyle !== null && mapInstance) {
      try {
        console.log(`Changing map style to: ${newStyle}`);
        setMapStyle(newStyle);
        mapInstance.setStyle(MAP_STYLES[newStyle]);
      } catch (error) {
        console.error('Error changing map style:', error);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
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
          '& .mapboxgl-canvas': {
            outline: 'none',
            width: '100% !important',
            height: '100% !important'
          },
        }}
      />
    </Box>
  );
}
