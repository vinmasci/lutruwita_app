import { parseString } from 'xml2js';
import { gpx } from '@tmcw/togeojson';
import simplify from 'simplify-js';
import {
  GpxProcessor,
  GpxData,
  Point,
  MatchedRoute,
  SurfaceData,
  ElevationData,
  ProcessingError,
  ElevationPoint,
} from './types';

type GpxParseResult = {
  gpx: {
    $: { creator: string };
    trk?: Array<{
      name?: string[];
      desc?: string[];
      trkseg?: Array<{
        trkpt?: Array<{
          $: { lat: string; lon: string };
          ele?: string[];
          time?: string[];
        }>;
      }>;
    }>;
    metadata?: {
      time?: string[];
    };
  };
};

export class BaseGpxProcessor implements GpxProcessor {
  /**
   * Parse a GPX file buffer into structured data
   */
  async parseFile(buffer: Buffer): Promise<GpxData> {
    try {
      // Convert buffer to string
      const xmlStr = buffer.toString('utf-8');

      // Parse XML to JS object
      const gpxData = await new Promise<GpxParseResult>((resolve, reject) => {
        parseString(xmlStr, (err: Error | null, result: GpxParseResult) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      // Extract track points
      const points: Point[] = [];
      const tracks = gpxData.gpx.trk || [];
      
      for (const track of tracks) {
        const segments = track.trkseg || [];
        for (const segment of segments) {
          const trackPoints = segment.trkpt || [];
          for (const trkpt of trackPoints) {
            points.push({
              lat: parseFloat(trkpt.$.lat),
              lon: parseFloat(trkpt.$.lon),
              elevation: trkpt.ele ? parseFloat(trkpt.ele[0]) : undefined,
              time: trkpt.time ? new Date(trkpt.time[0]) : undefined,
            });
          }
        }
      }

      return {
        name: gpxData.gpx.trk?.[0]?.name?.[0],
        description: gpxData.gpx.trk?.[0]?.desc?.[0],
        points,
        metadata: {
          time: gpxData.gpx.metadata?.time ? new Date(gpxData.gpx.metadata.time[0]) : undefined,
          creator: gpxData.gpx.$.creator,
        },
      };
    } catch (error: unknown) {
      const processingError: ProcessingError = new Error(
        `Failed to parse GPX file: ${error instanceof Error ? error.message : String(error)}`
      ) as ProcessingError;
      processingError.code = 'PARSE_ERROR';
      processingError.details = error;
      throw processingError;
    }
  }

  /**
   * Simplify track points using the Ramer-Douglas-Peucker algorithm
   */
  simplifyTrack(points: Point[]): Point[] {
    // Convert points to format expected by simplify-js
    const simplifyPoints = points.map((p: Point) => ({ x: p.lon, y: p.lat, data: p }));
    
    // Simplify with a reasonable tolerance (0.00015 degrees ≈ 15m at equator)
    const simplified = simplify(simplifyPoints, 0.00015, true);
    
    // Convert back to our Point format
    return simplified.map(p => p.data);
  }

  /**
   * Match track points to nearest roads using map matching service
   */
  async matchToRoads(points: Point[]): Promise<MatchedRoute> {
    try {
      // TODO: Implement actual map matching using a service like Mapbox Map Matching API
      // For now, return a simple copy of points with dummy matching data
      const matchedPoints = points.map((point, index) => ({
        ...point,
        originalIndex: index,
        roadName: 'Unknown Road',
        distance: 0,
      }));

      return {
        points: matchedPoints,
        distance: 0, // TODO: Calculate actual cumulative distance
        originalPoints: points,
      };
    } catch (error: unknown) {
      const processingError: ProcessingError = new Error(
        `Failed to match route to roads: ${error instanceof Error ? error.message : String(error)}`
      ) as ProcessingError;
      processingError.code = 'MATCH_ERROR';
      processingError.details = error;
      throw processingError;
    }
  }

  /**
   * Detect surface types along the route
   */
  async detectSurfaces(route: MatchedRoute): Promise<SurfaceData> {
    try {
      // TODO: Implement actual surface detection using ML model or map data
      // For now, return a dummy surface segment
      return {
        segments: [
          {
            startIndex: 0,
            endIndex: route.points.length - 1,
            surface: {
              type: 'unknown',
              confidence: 0.5,
            },
          },
        ],
      };
    } catch (error: unknown) {
      const processingError: ProcessingError = new Error(
        `Failed to detect surfaces: ${error instanceof Error ? error.message : String(error)}`
      ) as ProcessingError;
      processingError.code = 'SURFACE_ERROR';
      processingError.details = error;
      throw processingError;
    }
  }

  /**
   * Process elevation data to calculate statistics and grade
   */
  async processElevation(route: MatchedRoute): Promise<ElevationData> {
    try {
      const points: ElevationPoint[] = [];
      let distance = 0;
      let totalAscent = 0;
      let totalDescent = 0;
      let minElevation = Infinity;
      let maxElevation = -Infinity;

      // Process each point
      for (let i = 0; i < route.points.length; i++) {
        const point = route.points[i];
        const elevation = point.elevation || 0;

        // Update min/max elevation
        minElevation = Math.min(minElevation, elevation);
        maxElevation = Math.max(maxElevation, elevation);

        // Calculate grade if we have a previous point
        let grade = undefined;
        if (i > 0) {
          const prevPoint = route.points[i - 1];
          const prevElevation = prevPoint.elevation || 0;
          const elevationDiff = elevation - prevElevation;

          // Update ascent/descent
          if (elevationDiff > 0) {
            totalAscent += elevationDiff;
          } else {
            totalDescent += Math.abs(elevationDiff);
          }

          // Calculate grade (rise/run * 100 for percentage)
          if (point.distance) {
            const distanceDiff = point.distance;
            if (distanceDiff > 0) {
              grade = (elevationDiff / distanceDiff) * 100;
            }
          }
        }

        points.push({
          distance,
          elevation,
          grade,
        });

        // Update distance for next point
        if (point.distance) {
          distance += point.distance;
        }
      }

      return {
        points,
        statistics: {
          minElevation,
          maxElevation,
          totalAscent,
          totalDescent,
          averageGrade: distance > 0 ? ((maxElevation - minElevation) / distance) * 100 : 0,
        },
      };
    } catch (error: unknown) {
      const processingError: ProcessingError = new Error(
        `Failed to process elevation data: ${error instanceof Error ? error.message : String(error)}`
      ) as ProcessingError;
      processingError.code = 'ELEVATION_ERROR';
      processingError.details = error;
      throw processingError;
    }
  }
}
