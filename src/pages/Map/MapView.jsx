import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import styles from './MapView.module.scss';

// ── Leaflet Marker Icons Fix ──────────────────────────────────────────────────
// Resolves an issue where Leaflet marker icons are not correctly loaded 
// due to webpack/bundler URL rewriting.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

const LAYER_KEYS = ['temp_new', 'rain_radar', 'wind_new', 'clouds_new'];

const LAYER_ICONS = {
  temp_new:   '🌡',
  rain_radar: '📡',
  wind_new:   '💨',
  clouds_new: '☁️',
};

const LAYER_GRADIENT = {
  temp_new:   'linear-gradient(to right, #4facfe, #00c6ff, #f9d423, #ff4e50)',
  rain_radar: 'linear-gradient(to right, #e0f7fa, #4fc3f7, #0288d1, #7b1fa2)',
  wind_new:   'linear-gradient(to right, #e8f5e9, #66bb6a, #1b5e20)',
  clouds_new: 'linear-gradient(to right, #f5f7fa, #c3cfe2, #8e9eab)',
};

const LAYER_LABEL_KEY = {
  temp_new:   'temperature',
  rain_radar: 'precipitation',
  wind_new:   'wind',
  clouds_new: 'clouds',
};

const LAYER_DESC_KEY = {
  temp_new:   'tempDesc',
  rain_radar: 'precipDesc',
  wind_new:   'windDesc',
  clouds_new: 'cloudsDesc',
};

// ── RainViewer Animated Radar Layer ───────────────────────────────────────────

/**
 * Handles fetching, caching, and animating precipitation radar frames 
 * from the RainViewer API.
 */
const RainRadarLayer = () => {
  const map = useMap();

  useEffect(() => {
    let layers = [];
    let frameIdx = 0;
    let timer = null;
    let destroyed = false;

    // Cycles through the cached tile layers to create an animation effect
    const animate = () => {
      if (destroyed || !layers.length) return;
      layers.forEach((l, i) => l.setOpacity(i === frameIdx ? 0.7 : 0));
      frameIdx = (frameIdx + 1) % layers.length;
      timer = setTimeout(animate, 600);
    };

    // Fetches the most recent past frames from the public API
    const load = async () => {
      try {
        const res  = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        const past = data.radar?.past ?? [];
        if (!past.length || destroyed) return;

        // Retrieve the most recent 6 frames for a smoother loop
        const frames = past.slice(-6);

        layers = frames.map((frame) => {
          const layer = L.tileLayer(
            `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,
            {
              opacity:     0,
              zIndex:      500,
              tileSize:    256,
              attribution: 'RainViewer',
            }
          );
          layer.addTo(map);
          return layer;
        });

        // Delay initial loop to ensure the tiles have loaded successfully
        timer = setTimeout(animate, 800);

      } catch (e) {
        console.error('RainViewer error:', e);
      }
    };

    load();

    // Clean up timers and layers when removing or toggling the component
    return () => {
      destroyed = true;
      clearTimeout(timer);
      layers.forEach((l) => { try { map.removeLayer(l); } catch {} });
      layers = [];
    };
  }, [map]);

  return null;
};

// ── Map Viewport Center Synchronizer ──────────────────────────────────────────

/**
 * Updates the map's center and zoom levels whenever the selected location changes.
 */
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// ── Main Map Component ────────────────────────────────────────────────────────
const MapView = ({ lat = 49.44, lon = 32.06, t }) => {
  const [weatherLayer, setWeatherLayer] = useState('temp_new');
  const mt = t.map;

  const isRadar = weatherLayer === 'rain_radar';

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.header}>
        <Box>
          <Typography className={styles.overline}>{mt.realData}</Typography>
          <Typography variant="h5" className={styles.title}>{mt.title}</Typography>
          <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
            {mt.subtitle}
          </Typography>
        </Box>
        <Box className={styles.liveBadge}>
          <Box className={styles.liveDot} />
          <Typography className={styles.liveText}>{mt.live}</Typography>
        </Box>
      </Box>

      <Box className={styles.layerSwitcher}>
        {LAYER_KEYS.map((key) => (
          <Box
            key={key}
            onClick={() => setWeatherLayer(key)}
            className={`${styles.layerBtn} ${weatherLayer === key ? styles.layerBtnActive : ''}`}
          >
            <span className={styles.layerIcon}>{LAYER_ICONS[key]}</span>
            <span>{mt[LAYER_LABEL_KEY[key]]}</span>
          </Box>
        ))}
      </Box>

      <Box className={styles.mapContainer}>
        <MapContainer
          center={[lat, lon]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          {/* OpenWeatherMap overlay layers (Non-radar options) */}
          {!isRadar && (
            <TileLayer
              key={weatherLayer}
              url={`https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`}
              opacity={0.65}
            />
          )}

          {/* Animated RainViewer radar overlay */}
          {isRadar && <RainRadarLayer />}

          <ChangeView center={[lat, lon]} zoom={7} />
          <Marker position={[lat, lon]}>
            <Popup>
              <strong>{mt.yourLocation}</strong><br />
              {lat.toFixed(2)}, {lon.toFixed(2)}
            </Popup>
          </Marker>
        </MapContainer>

        {/* Live radar status indicator */}
        {isRadar && (
          <Box className={styles.radarBadge}>
            <span className={styles.radarDot} />
            📡 RADAR LIVE
          </Box>
        )}

        <Box className={styles.legend}>
          <Box className={styles.legendHeader}>
            <span>{LAYER_ICONS[weatherLayer]}</span>
            <Typography className={styles.legendTitle}>
              {mt[LAYER_LABEL_KEY[weatherLayer]]}
            </Typography>
          </Box>
          <Box
            className={styles.legendGradient}
            style={{ background: LAYER_GRADIENT[weatherLayer] }}
          />
          <Box className={styles.legendRange}>
            <Typography className={styles.legendLabel}>{mt.min}</Typography>
            <Typography className={styles.legendLabel}>{mt.max}</Typography>
          </Box>
        </Box>

        <Box className={styles.descChip}>
          <Typography className={styles.descText}>
            {mt[LAYER_DESC_KEY[weatherLayer]]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MapView;