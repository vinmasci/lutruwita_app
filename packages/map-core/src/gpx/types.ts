export interface Point {
  lat: number;
  lon: number;
  elevation?: number;
  time?: Date;
}

export interface GpxData {
  name?: string;
  description?: string;
  points: Point[];
  metadata?: {
    time?: Date;
    creator?: string;
  };
}

export interface MatchedPoint extends Point {
  originalIndex: number;
  roadName?: string;
  distance?: number;
}

export interface MatchedRoute {
  points: MatchedPoint[];
  distance: number;
  originalPoints: Point[];
}

export interface SurfaceType {
  type: 'paved' | 'unpaved' | 'trail' | 'unknown';
  confidence: number;
}

export interface SurfaceSegment {
  startIndex: number;
  endIndex: number;
  surface: SurfaceType;
}

export interface SurfaceData {
  segments: SurfaceSegment[];
}

export interface ElevationPoint {
  distance: number;
  elevation: number;
  grade?: number;
}

export interface ElevationData {
  points: ElevationPoint[];
  statistics: {
    minElevation: number;
    maxElevation: number;
    totalAscent: number;
    totalDescent: number;
    averageGrade: number;
  };
}

export interface GpxProcessor {
  parseFile(buffer: Buffer): Promise<GpxData>;
  simplifyTrack(points: Point[]): Point[];
  matchToRoads(points: Point[]): Promise<MatchedRoute>;
  detectSurfaces(route: MatchedRoute): Promise<SurfaceData>;
  processElevation(route: MatchedRoute): Promise<ElevationData>;
}

export interface ProcessingError extends Error {
  code: 'PARSE_ERROR' | 'MATCH_ERROR' | 'SURFACE_ERROR' | 'ELEVATION_ERROR';
  details?: unknown;
}
