import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import styles from './MapView.module.scss';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

const LAYER_KEYS = ['temp_new', 'precipitation_new', 'wind_new'];

const LAYER_ICONS = {
  temp_new:          '🌡',
  precipitation_new: '🌧',
  wind_new:          '💨',
};

const LAYER_GRADIENT = {
  temp_new:          'linear-gradient(to right, #4facfe, #00c6ff, #f9d423, #ff4e50)',
  precipitation_new: 'linear-gradient(to right, #e0f7fa, #4fc3f7, #0288d1, #01579b)',
  wind_new:          'linear-gradient(to right, #e8f5e9, #66bb6a, #1b5e20)',
};

// map layer key → translation key
const LAYER_LABEL_KEY = {
  temp_new:          'temperature',
  precipitation_new: 'precipitation',
  wind_new:          'wind',
};

const LAYER_DESC_KEY = {
  temp_new:          'tempDesc',
  precipitation_new: 'precipDesc',
  wind_new:          'windDesc',
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapView = ({ lat = 49.44, lon = 32.06, t }) => {
  const [weatherLayer, setWeatherLayer] = useState('temp_new');
  const mt = t.map;

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
            className="dark-tiles"
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`}
            opacity={0.6}
          />
          <ChangeView center={[lat, lon]} zoom={7} />
          <Marker position={[lat, lon]}>
            <Popup>
              <strong>{mt.yourLocation}</strong><br />
              {lat.toFixed(2)}, {lon.toFixed(2)}
            </Popup>
          </Marker>
        </MapContainer>

        <Box className={styles.legend}>
          <Box className={styles.legendHeader}>
            <span>{LAYER_ICONS[weatherLayer]}</span>
            <Typography className={styles.legendTitle}>
              {mt[LAYER_LABEL_KEY[weatherLayer]]}
            </Typography>
          </Box>
          <Box className={styles.legendGradient} style={{ background: LAYER_GRADIENT[weatherLayer] }} />
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