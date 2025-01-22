export type LayerType = 'marker' | 'line' | 'polygon' | 'circle';

export interface BaseLayer {
  id: string;
  type: LayerType;
  visible: boolean;
  name: string;
  description?: string;
}

export interface MarkerLayer extends BaseLayer {
  type: 'marker';
  coordinates: [number, number];
  color?: string;
  icon?: string;
}

export interface LineLayer extends BaseLayer {
  type: 'line';
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
}

export interface PolygonLayer extends BaseLayer {
  type: 'polygon';
  coordinates: [number, number][][];
  fillColor?: string;
  outlineColor?: string;
  opacity?: number;
}

export interface CircleLayer extends BaseLayer {
  type: 'circle';
  coordinates: [number, number];
  radius: number;
  color?: string;
  opacity?: number;
}

export type Layer = MarkerLayer | LineLayer | PolygonLayer | CircleLayer;

export interface LayerGroup {
  id: string;
  name: string;
  layers: Layer[];
  visible: boolean;
  expanded?: boolean;
}
