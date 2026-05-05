import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import L from 'leaflet';

import WeatherApp from './WeatherApp';

// ── Leaflet Marker Icons Fix ──────────────────────────────────────────────────
// Resolves an issue where Leaflet marker icons are not correctly loaded 
// due to webpack/bundler URL rewriting.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ── React Query Initialization ────────────────────────────────────────────────
const queryClient = new QueryClient();

/**
 * Root Component.
 * Contains only global providers (e.g., React Query).
 * All layout and business logic resides in WeatherApp.jsx.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherApp />
    </QueryClientProvider>
  );
}