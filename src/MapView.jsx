import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const LAYER_LABELS = {
  temp_new: 'Температура',
  precipitation_new: 'Опади',
  wind_new: 'Вітер',
};

const LAYER_GRADIENT = {
  temp_new: 'linear-gradient(to right, #4facfe, #00c6ff, #f9d423, #ff4e50)',
  precipitation_new: 'linear-gradient(to right, #e0f7fa, #4fc3f7, #0288d1, #01579b)',
  wind_new: 'linear-gradient(to right, #e8f5e9, #66bb6a, #1b5e20)',
};

const LAYER_ICONS = {
  temp_new: '🌡',
  precipitation_new: '🌧',
  wind_new: '💨',
};

const LAYER_DESCRIPTIONS = {
  temp_new: 'Розподіл температур',
  precipitation_new: 'Кількість опадів',
  wind_new: 'Швидкість вітру',
};

export const MapView = ({ lat = 49.44, lon = 32.06 }) => {
  const [weatherLayer, setWeatherLayer] = useState('temp_new');
  const OPENWEATHER_API_KEY = 'YOUR_KEY_HERE';

  return (
    <Box sx={{
      p: { xs: 0, sm: 0.5 },
      animation: 'fadeIn 0.5s ease-in-out',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <Box sx={{
        mb: { xs: 2, sm: 3 },
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'flex-end' },
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1.5,
      }}>
        <Box>
          <Typography sx={{
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#4facfe',
            mb: 0.5,
            fontWeight: 800,
          }}>
            Реальні дані
          </Typography>
          <Typography variant="h5" sx={{
            fontWeight: 900,
            lineHeight: 1.1,
            mb: 0.5,
            fontSize: { xs: 20, sm: 24 },
            letterSpacing: '-0.3px',
          }}>
            Метеорологічна мапа
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
            Погодні шари в реальному часі
          </Typography>
        </Box>

        {/* Live badge */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.75,
          py: 0.75,
          borderRadius: 10,
          bgcolor: 'rgba(91,184,50,0.1)',
          border: '1px solid rgba(91,184,50,0.25)',
          alignSelf: 'flex-start',
        }}>
          <Box sx={{
            width: 6, height: 6,
            borderRadius: '50%',
            bgcolor: '#5AB832',
            animation: 'livePulse 2s infinite',
          }} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#5AB832' }}>
            LIVE
          </Typography>
        </Box>
      </Box>

      {/* Layer switcher */}
      <Box sx={{
        display: 'flex',
        gap: { xs: 0.75, sm: 1 },
        mb: { xs: 2, sm: 2.5 },
        flexWrap: 'wrap',
      }}>
        {Object.entries(LAYER_LABELS).map(([key, label]) => {
          const isActive = weatherLayer === key;
          return (
            <Box
              key={key}
              onClick={() => setWeatherLayer(key)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.6, sm: 0.75 },
                borderRadius: 3,
                fontSize: { xs: 12, sm: 13 },
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s',
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                bgcolor: isActive ? 'rgba(79,172,254,0.12)' : 'background.paper',
                color: isActive ? 'primary.main' : 'text.secondary',
                boxShadow: isActive ? '0 2px 12px rgba(79,172,254,0.15)' : 'none',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: isActive ? 'rgba(79,172,254,0.12)' : 'rgba(79,172,254,0.05)',
                },
              }}
            >
              <span style={{ fontSize: 15 }}>{LAYER_ICONS[key]}</span>
              <span>{label}</span>
            </Box>
          );
        })}
      </Box>

      {/* Map container */}
      <Box sx={{
        height: { xs: '50vh', sm: '58vh', md: '66vh' },
        borderRadius: { xs: 3, sm: 4 },
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
      }}>
        <MapContainer
          center={[lat, lon]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
            className="dark-tiles"
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            opacity={0.6}
          />
          <ChangeView center={[lat, lon]} zoom={7} />
          <Marker position={[lat, lon]}>
            <Popup>
              <strong>Ваша локація</strong><br />
              {lat.toFixed(2)}, {lon.toFixed(2)}
            </Popup>
          </Marker>
        </MapContainer>

        {/* Legend */}
        <Box sx={{
          position: 'absolute',
          bottom: { xs: 14, sm: 20 },
          left: { xs: 14, sm: 20 },
          bgcolor: 'rgba(8,11,15,0.88)',
          backdropFilter: 'blur(16px)',
          p: { xs: '10px 12px', sm: '12px 16px' },
          borderRadius: { xs: 2.5, sm: 3 },
          zIndex: 1000,
          border: '1px solid rgba(255,255,255,0.08)',
          minWidth: { xs: 130, sm: 160 },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <span style={{ fontSize: 13 }}>{LAYER_ICONS[weatherLayer]}</span>
            <Typography sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 800,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {LAYER_LABELS[weatherLayer]}
            </Typography>
          </Box>
          <Box sx={{
            width: '100%',
            height: 7,
            background: LAYER_GRADIENT[weatherLayer],
            borderRadius: 4,
            mb: 0.75,
          }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}>Мін</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}>Макс</Typography>
          </Box>
        </Box>

        {/* Zoom buttons */}
        <Box sx={{
          position: 'absolute',
          top: { xs: 14, sm: 20 },
          right: { xs: 14, sm: 20 },
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}>
          {['+', '−'].map((btn) => (
            <Box
              key={btn}
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                bgcolor: 'rgba(8,11,15,0.88)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: 16, sm: 18 },
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s',
                '&:hover': {
                  bgcolor: 'rgba(79,172,254,0.2)',
                  borderColor: 'rgba(79,172,254,0.5)',
                  color: '#fff',
                },
              }}
            >
              {btn}
            </Box>
          ))}
        </Box>

        {/* Layer description chip */}
        <Box sx={{
          position: 'absolute',
          top: { xs: 14, sm: 20 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          bgcolor: 'rgba(8,11,15,0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          px: 2, py: 0.75,
          whiteSpace: 'nowrap',
        }}>
          <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            {LAYER_DESCRIPTIONS[weatherLayer]}
          </Typography>
        </Box>
      </Box>

      <style>{`
        .dark-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-container {
          background-color: #050505 !important;
        }
        .leaflet-control-zoom {
          display: none !important;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </Box>
  );
};