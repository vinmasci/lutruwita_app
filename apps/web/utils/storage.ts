export const STORAGE_KEYS = {
  MAP_STATE: 'map_state',
} as const;

export type MapStyle = 'outdoors' | 'satellite' | 'streets';

export interface StoredMapState {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  style?: MapStyle;
}

export const DEFAULT_MAP_STATE: StoredMapState = {
  center: [146.8087, -41.4419], // Tasmania center coordinates
  zoom: 7,
  bearing: 0,
  pitch: 0,
  style: 'outdoors', // Set outdoors as default style to match initial client state
};

const isClient = typeof window !== 'undefined';

// Validate stored state to ensure it matches expected format
function isValidStoredState(state: any): state is StoredMapState {
  return (
    state &&
    Array.isArray(state.center) &&
    state.center.length === 2 &&
    typeof state.center[0] === 'number' &&
    typeof state.center[1] === 'number' &&
    typeof state.zoom === 'number' &&
    typeof state.bearing === 'number' &&
    typeof state.pitch === 'number' &&
    (!state.style || ['outdoors', 'satellite', 'streets'].includes(state.style))
  );
}

export function saveMapState(state: StoredMapState): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.MAP_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save map state:', error);
  }
}

export function loadMapState(): StoredMapState | null {
  if (!isClient) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MAP_STATE);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    if (!isValidStoredState(parsed)) {
      console.warn('Invalid stored map state, using defaults');
      clearMapState(); // Clean up invalid state
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load map state:', error);
    return null;
  }
}

export function clearMapState(): void {
  if (!isClient) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.MAP_STATE);
  } catch (error) {
    console.error('Failed to clear map state:', error);
  }
}
