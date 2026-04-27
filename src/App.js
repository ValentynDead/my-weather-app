import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Box, Card, Typography, CircularProgress, Grid,
  ThemeProvider, createTheme, CssBaseline, Stack, IconButton,
  InputBase, Avatar, Drawer, useMediaQuery,
} from '@mui/material';
import L from 'leaflet';

import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { MapView } from './MapView';
import { CalendarView } from './CalendarView';
import { SettingsView } from './SettingsView';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const queryClient = new QueryClient();

const OTHER_CITIES_LIST = [
  { name: 'Лондон', country: 'UK', lat: 51.50, lon: -0.12 },
  { name: 'Нью-Йорк', country: 'USA', lat: 40.71, lon: -74.00 },
  { name: 'Токіо', country: 'Japan', lat: 35.68, lon: 139.76 },
];
const fetchWeatherData = async () => {
  const geo = await axios.get('https://get.geojs.io/v1/ip/geo.json');
  const { latitude: lat, longitude: lon } = geo.data;

// Отримуємо правильну назву міста через nominatim
const geoName = await axios.get(
  `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=uk`
);
const city = geoName.data.address.city 
  || geoName.data.address.town 
  || geoName.data.address.village 
  || geoName.data.address.county 
  || geo.data.city;

  // 7 днів для дашборду
  const res = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
    `&forecast_days=7&timezone=auto`
  );

  // 16 днів для календаря
  const resCalendar = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=16&timezone=auto`
  );

  const others = await Promise.all(
    OTHER_CITIES_LIST.map(async (c) => {
      const r = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
        `&current=temperature_2m,weather_code&timezone=auto`
      );
      return { ...c, temp: Math.round(r.data.current.temperature_2m), code: r.data.current.weather_code };
    })
  );

  return {
    city,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    current: res.data.current,
    daily: res.data.daily,           // 7 днів → для DashboardView
    dailyCalendar: resCalendar.data.daily,  // 16 днів → для CalendarView
    others,
  };
};


const getWeatherStyle = (code) => {
  if (code === 0) return { label: 'Ясно', emoji: '☀️', img: 'https://cdn-icons-png.flaticon.com/512/869/869869.png' };
  if (code >= 1 && code <= 3) return { label: 'Хмарно', emoji: '⛅', img: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Дощ', emoji: '🌧️', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' };
  return { label: 'Хмарно', emoji: '⛅', img: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' };
};

const NAV_ITEMS = [
  { id: 'dashboard', icon: <GridViewIcon />, label: 'Дашборд' },
  { id: 'map', icon: <MapIcon />, label: 'Карта' },
  { id: 'calendar', icon: <CalendarMonthIcon />, label: 'Календар' },
  { id: 'settings', icon: <SettingsIcon />, label: 'Налаштування' },
  { id: 'help', icon: <HelpOutlineIcon />, label: 'Довідка' },
];

// ─── Metric Card ─────────────────────────────────────────────────────────────
const MetricCard = ({ icon, label, value, mode }) => (
  <Card sx={{
    p: { xs: 1.5, sm: 2 },
    textAlign: 'center',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: mode === 'dark'
        ? '0 8px 32px rgba(79,172,254,0.15)'
        : '0 8px 24px rgba(79,172,254,0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, rgba(79,172,254,0.5), transparent)',
    },
  }}>
    <Typography fontSize={{ xs: 20, sm: 26 }} sx={{ mb: 0.5 }}>{icon}</Typography>
    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: { xs: 10, sm: 12 } }}>{label}</Typography>
    <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, fontSize: { xs: 14, sm: 18 } }}>{value}</Typography>
  </Card>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DashboardView = ({ data, mode }) => {
  const weather = getWeatherStyle(data.current.weather_code);

  const metrics = [
    { icon: '💨', label: 'Вітер', value: `${Math.round(data.current.wind_speed_10m)} км/год` },
    { icon: '💧', label: 'Вологість', value: `${data.current.relative_humidity_2m}%` },
    { icon: '☀️', label: 'УФ Індекс', value: Math.round(data.current.uv_index) },
    { icon: '👁', label: 'Видимість', value: '10 км' },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ animation: 'fadeIn 0.4s' }}>
      {/* Left column */}
      <Grid item xs={12} md={4}>
        <Stack spacing={2}>
          {/* Main weather card */}
          <Card sx={{
            p: { xs: 2.5, sm: 3.5 },
            background: mode === 'dark'
              ? 'linear-gradient(135deg, rgba(79,172,254,0.12) 0%, rgba(0,198,255,0.04) 50%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(135deg, #dbeeff 0%, #f0f8ff 50%, #ffffff 100%)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: mode === 'dark'
              ? '0 4px 40px rgba(79,172,254,0.08)'
              : '0 4px 24px rgba(79,172,254,0.12)',
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0, left: '10%', right: '10%',
              height: 2,
              background: 'linear-gradient(90deg, transparent, #4facfe, transparent)',
            }} />
            {/* Decorative orb */}
            <Box sx={{
              position: 'absolute',
              top: -40, right: -40,
              width: 140, height: 140,
              borderRadius: '50%',
              background: mode === 'dark'
                ? 'radial-gradient(circle, rgba(79,172,254,0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(79,172,254,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, textTransform: 'capitalize', fontSize: { xs: 13, sm: 15 } }}>
                {new Date().toLocaleDateString('uk-UA', { weekday: 'long' })}
              </Typography>
              <Box sx={{
                fontSize: 11, fontWeight: 800, px: 1.5, py: 0.4,
                borderRadius: 2, bgcolor: 'rgba(79,172,254,0.15)',
                color: 'primary.main', letterSpacing: '0.06em',
              }}>°C</Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: 12, sm: 13 } }}>
              {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box component="img" src={weather.img}
                sx={{ width: { xs: 60, sm: 85 }, filter: 'drop-shadow(0 4px 16px rgba(79,172,254,0.35))' }}
              />
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: { xs: 48, sm: 62 }, fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
                  {Math.round(data.current.temperature_2m)}°
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 600, fontSize: { xs: 12, sm: 14 } }}>
                  {weather.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: 10, sm: 12 } }}>
                  Відчувається як {Math.round(data.current.apparent_temperature)}°
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Popular cities */}
          <Typography variant="caption" sx={{
            fontWeight: 800, px: 0.5, fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary',
          }}>
            Популярні міста
          </Typography>

          {data.others.map((city) => {
            const cs = getWeatherStyle(city.code);
            return (
              <Card key={city.name} sx={{
                p: { xs: 1.5, sm: 1.75 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateX(6px)',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(79,172,254,0.12)',
                },
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{
                    width: 38, height: 38,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(79,172,254,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {cs.emoji}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 14 } }}>{city.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>{city.country}</Typography>
                  </Box>
                </Stack>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: 17, sm: 20 }, letterSpacing: '-0.5px' }}>
                  {city.temp}°
                </Typography>
              </Card>
            );
          })}
        </Stack>
      </Grid>

      {/* Right column */}
      <Grid item xs={12} md={8}>
        <Typography variant="caption" sx={{
          mb: 1.5, display: 'block',
          fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary',
        }}>
          Показники сьогодні
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
          {metrics.map((m) => (
            <Grid item xs={6} sm={3} key={m.label}>
              <MetricCard {...m} mode={mode} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="caption" sx={{
          mb: 1.5, display: 'block',
          fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary',
        }}>
          Прогноз на тиждень
        </Typography>
        <Box sx={{
          display: 'flex', gap: { xs: 1, sm: 1.25 },
          overflowX: 'auto', pb: 1.5,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
          mx: { xs: -0.5, sm: 0 },
          px: { xs: 0.5, sm: 0 },
        }}>
          {data.daily.time.slice(0, 7).map((day, i) => {
            const ws = getWeatherStyle(data.daily.weather_code[i]);
            return (
              <Card key={day} sx={{
                p: { xs: 1.25, sm: 2 },
                minWidth: { xs: 72, sm: 96 },
                flex: '0 0 auto',
                textAlign: 'center',
                border: i === 0 ? '1.5px solid' : '1px solid',
                borderColor: i === 0 ? 'primary.main' : 'divider',
                bgcolor: i === 0 ? 'rgba(79,172,254,0.07)' : 'background.paper',
                transition: 'transform 0.18s, box-shadow 0.18s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(79,172,254,0.15)',
                },
              }}>
                {i === 0 && (
                  <Box sx={{
                    position: 'absolute', top: 0, left: '15%', right: '15%',
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #4facfe, transparent)',
                  }} />
                )}
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', fontSize: { xs: 10, sm: 11 } }}>
                  {i === 0 ? 'Сьогодні' : new Date(day).toLocaleDateString('uk-UA', { weekday: 'short' })}
                </Typography>
                <Typography fontSize={{ xs: 22, sm: 28 }} sx={{ my: { xs: 0.75, sm: 1 } }}>{ws.emoji}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 900, fontSize: { xs: 13, sm: 15 } }}>
                  {Math.round(data.daily.temperature_2m_max[i])}°
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: 10, sm: 11 } }}>
                  {Math.round(data.daily.temperature_2m_min[i])}°
                </Typography>
              </Card>
            );
          })}
        </Box>
      </Grid>
    </Grid>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ activeTab, setActiveTab, onClose, isMobile }) => (
  <Box sx={{
    width: isMobile ? 240 : 68,
    bgcolor: 'background.paper',
    borderRadius: isMobile ? 0 : '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMobile ? 'flex-start' : 'center',
    py: 2.5,
    px: isMobile ? 2.5 : 0,
    border: '1px solid',
    borderColor: 'divider',
    height: isMobile ? '100%' : 'auto',
    flexShrink: 0,
  }}>
    {/* Logo dot */}
    {!isMobile && (
      <Box sx={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, #4facfe, #00c6ff)',
        mb: 3, boxShadow: '0 4px 12px rgba(79,172,254,0.4)',
        flexShrink: 0,
      }} />
    )}

    <Stack spacing={0.5} alignItems={isMobile ? 'flex-start' : 'center'} width="100%">
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2.5, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4facfe, #00c6ff)',
              boxShadow: '0 2px 8px rgba(79,172,254,0.4)',
            }} />
            <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Меню</Typography>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
      )}
      {NAV_ITEMS.map((item) => {
        const active = activeTab === item.id;
        return (
          <Box
            key={item.id}
            onClick={() => { setActiveTab(item.id); if (onClose) onClose(); }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 1.75 : 0,
              justifyContent: isMobile ? 'flex-start' : 'center',
              width: isMobile ? '100%' : 46,
              height: 46,
              borderRadius: 2.5,
              px: isMobile ? 2 : 0,
              cursor: 'pointer',
              bgcolor: active ? 'primary.main' : 'transparent',
              color: active ? '#fff' : 'text.secondary',
              transition: 'all 0.18s',
              position: 'relative',
              '&:hover': {
                bgcolor: active ? 'primary.main' : 'action.hover',
                color: active ? '#fff' : 'text.primary',
              },
            }}
          >
            {React.cloneElement(item.icon, { fontSize: 'small' })}
            {isMobile && (
              <Typography variant="body2" sx={{ fontWeight: active ? 700 : 500, fontSize: 14 }}>
                {item.label}
              </Typography>
            )}
            {/* Active indicator dot for desktop */}
            {active && !isMobile && (
              <Box sx={{
                position: 'absolute',
                right: -8,
                width: 3,
                height: 20,
                borderRadius: 2,
                bgcolor: 'primary.main',
              }} />
            )}
          </Box>
        );
      })}
    </Stack>
  </Box>
);

const PAGE_TITLES = {
  dashboard: 'Добрий день',
  map: 'Метеокарта',
  calendar: 'Планувальник',
  settings: 'Налаштування',
  help: 'Довідка',
};

// ─── Main App ─────────────────────────────────────────────────────────────────
function WeatherApp() {
  const [mode, setMode] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#080B0F' : '#EEF2F7',
        paper: mode === 'dark' ? '#111418' : '#FFFFFF',
      },
      primary: { main: '#4facfe' },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "'DM Sans', Inter, sans-serif",
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: mode === 'dark'
              ? '0 2px 12px rgba(0,0,0,0.3)'
              : '0 2px 12px rgba(0,0,0,0.06)',
          },
        },
      },
    },
  }), [mode]);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weatherData'],
    queryFn: fetchWeatherData,
  });

  if (isLoading) return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        height: '100vh', gap: 2.5,
        background: mode === 'dark'
          ? 'radial-gradient(ellipse at 50% 50%, rgba(79,172,254,0.04) 0%, #080B0F 70%)'
          : '#EEF2F7',
      }}>
        <Box sx={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4facfe, #00c6ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(79,172,254,0.4)',
          animation: 'pulse 2s infinite',
          fontSize: 22,
        }}>☁️</Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, letterSpacing: '0.02em' }}>
          Завантаження даних погоди…
        </Typography>
      </Box>
    </ThemeProvider>
  );

  if (isError) return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography sx={{ fontSize: 36, mb: 2 }}>⚠️</Typography>
          <Typography color="error" sx={{ fontSize: 14 }}>
            Помилка завантаження даних. Перевірте з'єднання.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 240, bgcolor: 'background.paper' } }}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setDrawerOpen(false)} isMobile />
      </Drawer>

      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        p: { xs: 1.5, sm: 2, md: 3 },
        gap: { xs: 0, md: 2.5 },
        pb: { xs: '80px', md: 3 },
        background: mode === 'dark'
          ? 'radial-gradient(ellipse at 0% 0%, rgba(79,172,254,0.03) 0%, transparent 50%)'
          : 'none',
      }}>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={false} />
        )}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>

          {/* Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: { xs: 2.5, md: 3.5 },
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {isMobile && (
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  size="small"
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
              )}
              <Box>
                <Typography
                  sx={{ fontWeight: 900, lineHeight: 1.1, fontSize: { xs: 18, sm: 20, md: 24 }, letterSpacing: '-0.3px' }}
                >
                  {PAGE_TITLES[activeTab]}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: 11, sm: 12 } }}>
                  📍 {data.city}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              {!isMobile && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  px: 2,
                  borderRadius: 10,
                  width: { sm: 180, md: 220 },
                  height: 40,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 3px rgba(79,172,254,0.1)',
                  },
                }}>
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 17 }} />
                  <InputBase placeholder="Пошук локації…" fullWidth sx={{ fontSize: 13 }} />
                </Box>
              )}
              <Box
                onClick={() => setMode(m => m === 'dark' ? 'light' : 'dark')}
                sx={{
                  width: 38, height: 38,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 17,
                  transition: 'border-color 0.2s, transform 0.3s',
                  '&:hover': { borderColor: 'primary.main', transform: 'rotate(20deg)' },
                }}
              >
                {mode === 'dark' ? '☀️' : '🌙'}
              </Box>
              <Avatar
                src="https://i.pravatar.cc/150?u=valentin"
                sx={{
                  width: 38, height: 38,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(79,172,254,0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.08)' },
                }}
              />
            </Box>
          </Box>

          {/* Pages */}
          <Box sx={{ animation: 'fadeIn 0.35s ease-out' }}>
            {activeTab === 'dashboard' && <DashboardView data={data} mode={mode} />}
            {activeTab === 'map' && <MapView lat={data.lat} lon={data.lon} />}
          {activeTab === 'calendar' && <CalendarView data={{ daily: data.dailyCalendar }} />}
            {activeTab === 'settings' && (
              <SettingsView
                isDark={mode === 'dark'}
                onToggleTheme={() => setMode(m => m === 'dark' ? 'light' : 'dark')}
              />
            )}
            {activeTab === 'help' && (
              <Box sx={{ maxWidth: 560 }}>
                <Typography sx={{
                  fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'primary.main', mb: 1, fontWeight: 800,
                }}>
                  Підтримка
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: 20, sm: 24 } }}>
                  Центр допомоги
                </Typography>

                {/* Help cards */}
                {[
                  { icon: '🌍', title: 'Джерело даних', desc: 'Погодні дані надає Open-Meteo API — безкоштовний відкритий сервіс прогнозів.' },
                  { icon: '📍', title: 'Геолокація', desc: 'Ваше місцезнаходження визначається автоматично за IP-адресою через GeoJS.' },
                  { icon: '💬', title: 'Зворотний зв\'язок', desc: 'Для питань та пропозицій звертайтесь до розробника через форму зворотного зв\'язку.' },
                ].map((item) => (
                  <Card key={item.title} sx={{
                    p: 2.5, mb: 1.5,
                    display: 'flex', gap: 2, alignItems: 'flex-start',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    '&:hover': { transform: 'translateX(4px)', borderColor: 'primary.main' },
                  }}>
                    <Box sx={{
                      fontSize: 22, width: 44, height: 44, flexShrink: 0,
                      borderRadius: 2.5, bgcolor: 'rgba(79,172,254,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{item.icon}</Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: 14 }}>{item.title}</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.6 }}>{item.desc}</Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Box sx={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid', borderColor: 'divider',
          display: 'flex', justifyContent: 'space-around',
          py: 0.75, zIndex: 1200,
          pb: 'calc(env(safe-area-inset-bottom) + 6px)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        }}>
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <Box
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 0.3, px: 1.5, py: 0.75, borderRadius: 2.5, cursor: 'pointer',
                  color: active ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.18s, transform 0.18s',
                  transform: active ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                }}
              >
                {active && (
                  <Box sx={{
                    position: 'absolute',
                    top: -1, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 20, height: 2,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                  }} />
                )}
                {React.cloneElement(item.icon, { fontSize: 'small' })}
                <Typography variant="caption" sx={{ fontSize: 9, fontWeight: active ? 800 : 400, lineHeight: 1 }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(79,172,254,0.4); }
          50% { transform: scale(1.06); box-shadow: 0 4px 28px rgba(79,172,254,0.6); }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherApp />
    </QueryClientProvider>
  );
}