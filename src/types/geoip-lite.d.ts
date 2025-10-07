declare module 'geoip-lite' {
  export interface GeoData {
    range: [number, number];
    country: string;
    region: string;
    eu: '0' | '1';
    timezone: string;
    city: string;
    ll: [number, number];
    metro: number;
    area: number;
  }

  export function lookup(ip: string): GeoData | null;
  export function pretty(ip: number): string;
  export function startWatchingDataUpdate(): void;
  export function stopWatchingDataUpdate(): void;
}