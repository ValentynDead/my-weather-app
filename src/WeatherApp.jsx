import React, { useState, useMemo } from 'react';
import {
  Box, ThemeProvider, CssBaseline, Drawer, useMediaQuery, Typography,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import GridViewIcon      from '@mui/icons-material/GridView';
import MapIcon           from '@mui/icons-material/Map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon      from '@mui/icons-material/Settings';
import HelpOutlineIcon   from '@mui/icons-material/HelpOutlined';

import Sidebar       from './components/Sidebar/Sidebar';
import Header        from './components/Header/Header';
import DashboardView from './pages/Dashboard/DashboardView';
import MapView       from './pages/Map/MapView';
import CalendarView  from './pages/Calendar/CalendarView';
import SettingsView  from './pages/Settings/SettingsView';
import HelpView      from './pages/Help/HelpView';

import { useWeatherData } from './hooks/useWeatherData';
import { NAV_ITEMS }      from './utils/constants';
import { getT }           from './i18n/translations';
import './WeatherApp.scss';

const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#080B0F' : '#EEF2F7',
        paper:   mode === 'dark' ? '#111418' : '#FFFFFF',
      },
      primary: { main: '#4facfe' },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    },
    shape: { borderRadius: 14 },
    typography: { fontFamily: "'DM Sans', Inter, sans-serif" },
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
  });

const LoadingScreen = () => (
  <Box className="loading-screen">
    <Box className="loading-orb">☁️</Box>
    <Typography variant="body2" color="text.secondary" className="loading-text">
      Завантаження даних погоди…
    </Typography>
  </Box>
);

const ErrorScreen = () => (
  <Box className="error-screen">
    <Typography sx={{ fontSize: 36, mb: 2 }}>⚠️</Typography>
    <Typography color="error" sx={{ fontSize: 14 }}>
      Помилка завантаження даних. Перевірте з'єднання.
    </Typography>
  </Box>
);

const NAV_ICONS = {
  dashboard: <GridViewIcon />,
  map:       <MapIcon />,
  calendar:  <CalendarMonthIcon />,
  settings:  <SettingsIcon />,
  help:      <HelpOutlineIcon />,
};

const BottomNav = ({ activeTab, setActiveTab, t }) => (
  <Box className="bottom-nav">
    {NAV_ITEMS.map((item) => {
      const active = activeTab === item.id;
      return (
        <Box
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
        >
          {active && <Box className="bottom-nav__indicator" />}
          {React.cloneElement(NAV_ICONS[item.id], { fontSize: 'small' })}
          <Typography variant="caption" className="bottom-nav__label">
            {t.nav[item.id]}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

const WeatherApp = () => {
  const [mode,       setMode]       = useState('dark');
  const [activeTab,  setActiveTab]  = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lang,       setLang]       = useState('uk');
  const [unit,       setUnit]       = useState('c');

  const t        = useMemo(() => getT(lang), [lang]);
  const theme    = useMemo(() => buildTheme(mode), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleTheme = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const { data, isLoading, isError } = useWeatherData();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {isLoading && <LoadingScreen />}
      {isError   && <ErrorScreen />}

      {data && (
        <>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: 240, bgcolor: 'background.paper' } }}
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={() => setDrawerOpen(false)}
              isMobile
              t={t}
            />
          </Drawer>

          <Box className={`app-layout ${mode === 'dark' ? 'app-layout--dark theme-dark' : 'app-layout--light theme-light'}`}>
            {!isMobile && (
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={false} t={t} />
            )}

            <Box className="app-main">
              <Header
                activeTab={activeTab}
                city={data.city}
                mode={mode}
                isMobile={isMobile}
                onMenuOpen={() => setDrawerOpen(true)}
                onToggleTheme={toggleTheme}
                t={t}
              />

              <Box className="app-page">
                {activeTab === 'dashboard' && (
                  <DashboardView data={data} t={t} unit={unit} />
                )}
                {activeTab === 'map'      && (
                  <MapView lat={data.lat} lon={data.lon} t={t} />
                )}
                {activeTab === 'calendar' && (
                  <CalendarView data={{ daily: data.dailyCalendar }} t={t} unit={unit} />
                )}
                {activeTab === 'settings' && (
                  <SettingsView
                    onToggleTheme={toggleTheme}
                    lang={lang}
                    onLangChange={setLang}
                    unit={unit}
                    onUnitChange={setUnit}
                    t={t}
                  />
                )}
                {activeTab === 'help' && <HelpView t={t} />}
              </Box>
            </Box>
          </Box>

          {isMobile && (
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
          )}
        </>
      )}
    </ThemeProvider>
  );
};

export default WeatherApp;