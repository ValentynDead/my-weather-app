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

/**
 * Builds the application Material-UI theme dynamically based on the mode.
 * @param {'light' | 'dark'} mode - Current UI theme mode.
 * @returns {Theme} Material-UI Theme object.
 */
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

// ── Fallback Screens ──────────────────────────────────────────────────────────

/**
 * Renders the loading screen overlay while fetching weather data.
 */
const LoadingScreen = () => (
  <Box className="loading-screen">
    <Box className="loading-orb">☁️</Box>
    <Typography variant="body2" color="text.secondary" className="loading-text">
      Завантаження даних погоди…
    </Typography>
  </Box>
);

/**
 * Renders the error screen with a fallback reset option.
 * @param {Function} onReset - Callback to revert to default city.
 */
const ErrorScreen = ({ onReset }) => (
  <Box className="error-screen">
    <Typography sx={{ fontSize: 36, mb: 2 }}>⚠️</Typography>
    <Typography color="error" sx={{ fontSize: 14, mb: 2 }}>
      Місто не знайдено або помилка завантаження. Перевірте назву міста.
    </Typography>
    <Box
      onClick={onReset}
      sx={{
        cursor: 'pointer',
        color: '#4facfe',
        fontSize: 14,
        textDecoration: 'underline',
      }}
    >
      Повернутись до мого міста
    </Box>
  </Box>
);

const NAV_ICONS = {
  dashboard: <GridViewIcon />,
  map:       <MapIcon />,
  calendar:  <CalendarMonthIcon />,
  settings:  <SettingsIcon />,
  help:      <HelpOutlineIcon />,
};

// ── Mobile Navigation ─────────────────────────────────────────────────────────

/**
 * Renders the bottom navigation bar on mobile devices.
 */
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

// ── Main Application Component ────────────────────────────────────────────────
const WeatherApp = () => {
  // Localized and persisted state management
  const [mode, setMode] = useState(() => localStorage.getItem('theme') ?? 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('lang')  ?? 'uk');
  const [unit, setUnit] = useState(() => localStorage.getItem('unit')  ?? 'c');

  // View & UI state management
  const [activeTab,  setActiveTab]  = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchCity, setSearchCity] = useState(null);

  // Memoized layout options & translations
  const t        = useMemo(() => getT(lang), [lang]);
  const theme    = useMemo(() => buildTheme(mode), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Toggles between Light and Dark themes.
   */
  const toggleTheme = () => {
    setMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  /**
   * Updates language and saves setting to LocalStorage.
   * @param {string} val - New language code.
   */
  const handleLangChange = (val) => {
    setLang(val);
    localStorage.setItem('lang', val);
  };

  /**
   * Updates temperature unit and saves setting to LocalStorage.
   * @param {'c' | 'f'} val - Unit type.
   */
  const handleUnitChange = (val) => {
    setUnit(val);
    localStorage.setItem('unit', val);
  };

  /**
   * Resets active search back to default user city location.
   */
  const handleReset = () => setSearchCity(null);

  // React Query data fetching hook
  const { data, isLoading, isError } = useWeatherData(lang, searchCity);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {isLoading && <LoadingScreen />}
      {isError   && <ErrorScreen onReset={handleReset} />}

      {data && (
        <>
          {/* Mobile Navigation Drawer */}
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
                onSearch={setSearchCity}
                t={t}
              />

              {/* View Router Section */}
              <Box className="app-page">
                {activeTab === 'dashboard' && (
                  <DashboardView
                    data={data}
                    t={t}
                    unit={unit}
                    onCityClick={setSearchCity}
                  />
                )}
                {activeTab === 'map' && (
                  <MapView lat={data.lat} lon={data.lon} t={t} />
                )}
                {activeTab === 'calendar' && (
                  <CalendarView data={{ daily: data.dailyCalendar }} t={t} unit={unit} />
                )}
                {activeTab === 'settings' && (
                  <SettingsView
                    isDark={mode === 'dark'}
                    onToggleTheme={toggleTheme}
                    lang={lang}
                    onLangChange={handleLangChange}
                    unit={unit}
                    onUnitChange={handleUnitChange}
                    t={t}
                    weatherData={data} // Pass full weather details to settings
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