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
  const { viewport, setViewport, mapStyle, setMapStyle } = useMap();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  
  // Event handlers
  const handleError = (e: mapboxgl.ErrorEvent) => {
    console.error('Map error:', e);
  };

  const handleMoveEnd = (e: mapboxgl.MapboxEvent) => {
    const map = e.target as mapboxgl.Map;
    if (!map) return;
    const center = map.getCenter().toArray() as [number, number];
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();
    setViewport({ center, zoom, bearing, pitch });
  };

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current || mapInstance.current) return;

    try {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[mapStyle],
        center: viewport.center,
        zoom: viewport.zoom,
        attributionControl: true,
        preserveDrawingBuffer: true,
        maxZoom: 18
      });

      const map = mapInstance.current;
      const navControl = new mapboxgl.NavigationControl();
      
      // Attach event handlers
      map.on('error', handleError);
      map.on('moveend', handleMoveEnd);
      map.addControl(navControl, 'top-right');

      return () => {
        if (mapInstance.current) {
          mapInstance.current.off('error', handleError);
          mapInstance.current.off('moveend', handleMoveEnd);
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  // Update map when viewport changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    try {
      map.setCenter(viewport.center);
      map.setZoom(viewport.zoom);
      map.setBearing(viewport.bearing);
      map.setPitch(viewport.pitch);
    } catch (error) {
      console.error('Error updating map:', error);
    }
  }, [viewport]);

  // Update map style
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    try {
      map.setStyle(MAP_STYLES[mapStyle]);
    } catch (error) {
      console.error('Error updating map style:', error);
    }
  }, [mapStyle]);

  const handleStyleChange = (_: React.MouseEvent<HTMLElement>, newStyle: MapStyle | null) => {
    if (newStyle !== null) {
      setMapStyle(newStyle);
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
