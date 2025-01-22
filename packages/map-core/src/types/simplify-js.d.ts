declare module 'simplify-js' {
  interface Point {
    x: number;
    y: number;
    [key: string]: any;
  }
  
  function simplify(
    points: Point[],
    tolerance?: number,
    highQuality?: boolean
  ): Point[];
  
  export default simplify;
}
