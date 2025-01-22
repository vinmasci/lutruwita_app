declare module '@tmcw/togeojson' {
  import { Document } from 'xmldom';
  import { Feature, FeatureCollection } from 'geojson';

  export function gpx(doc: Document | Node): FeatureCollection;
  export function kml(doc: Document | Node): FeatureCollection;
  export function tcx(doc: Document | Node): FeatureCollection;
}
