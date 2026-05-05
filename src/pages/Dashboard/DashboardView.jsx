import React, { useState } from 'react';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';

import MetricCard   from '../../components/MetricCard/MetricCard';
import WeekForecast from '../../components/WeekForecast/WeekForecast';
import { getWeatherStyle } from '../../utils/weatherHelpers';
import styles from './DashboardView.module.scss';

/**
 * Converts temperature from Celsius to the requested unit.
 * @param {number} celsius - Temperature in Celsius.
 * @param {'c' | 'f'} unit - Targeted display unit.
 * @returns {number} Converted and rounded temperature value.
 */
const toDisplay = (celsius, unit) =>
  unit === 'f' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);

// ── Left Sticky Column Components ─────────────────────────────────────────────

/**
 * Renders the main weather card showing current temperature and general conditions.
 */
const MainWeatherCard = ({ current, unit, t }) => {
  const weather = getWeatherStyle(current.weather_code, t.weather);
  return (
    <Card className={styles.mainCard}>
      <Box className={styles.mainCardTopLine} />
      <Box className={styles.mainCardOrb} />
      <Box className={styles.mainCardHeader}>
        <Typography className={styles.weekday}>
          {new Date().toLocaleDateString(t.locale, { weekday: 'long' })}
        </Typography>
        <Box className={styles.unitBadge}>°{unit.toUpperCase()}</Box>
      </Box>
      <Typography variant="body2" color="text.secondary" className={styles.dateStr}>
        {new Date().toLocaleDateString(t.locale, { day: 'numeric', month: 'long', year: 'numeric' })}
      </Typography>
      <Box className={styles.mainCardBody}>
        <Box component="img" src={weather.img} className={styles.weatherIcon} />
        <Box className={styles.tempBlock}>
          <Typography className={styles.temperature}>
            {toDisplay(current.temperature_2m, unit)}°
          </Typography>
          <Typography variant="body2" className={styles.weatherLabel}>
            {weather.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t.dashboard.feelsLike} {toDisplay(current.apparent_temperature, unit)}°
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

/**
 * Card component for displaying high-level weather info of other major cities.
 */
const CityCard = ({ city, unit, t, onClick }) => {
  const cs = getWeatherStyle(city.code, t.weather);
  return (
    <Card
      className={styles.cityCard}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(79,172,254,0.25)' },
        '&:active': { transform: 'translateY(0px)' },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box className={styles.cityEmoji}>{cs.emoji}</Box>
        <Box>
          <Typography variant="body2" className={styles.cityName}>
            {t.locale === 'uk-UA' ? city.name : city.nameEn}
          </Typography>
          <Typography variant="caption" color="text.secondary">{city.country}</Typography>
        </Box>
      </Stack>
      <Typography className={styles.cityTemp}>
        {toDisplay(city.temp, unit)}°
      </Typography>
    </Card>
  );
};

// ── Forecast Details Section ──────────────────────────────────────────────────

/**
 * Displays distinct weather metrics for the selected day in the forecast.
 */
const DayDetail = ({ daily, current, index, unit, t }) => {
  const ws = getWeatherStyle(daily.weather_code[index], t.weather);
  const day = daily.time[index];
  const dateLabel = index === 0
    ? t.dashboard.today
    : new Date(day).toLocaleDateString(t.locale, { weekday: 'long', day: 'numeric', month: 'long' });

  const isToday = index === 0;

  // Memoized dynamic metric values based on the active tab/day
  const metrics = [
    {
      icon: '🌡️',
      label: t.dashboard.feelsLike,
      value: isToday
        ? `${toDisplay(current.apparent_temperature, unit)}°`
        : `${toDisplay(daily.apparent_temperature_max?.[index] ?? daily.temperature_2m_max[index], unit)}°`,
    },
    {
      icon: '💧',
      label: t.dashboard.humidity,
      value: isToday
        ? `${current.relative_humidity_2m}%`
        : `${daily.precipitation_probability_max?.[index] ?? '—'}%`,
    },
    {
      icon: '💨',
      label: t.dashboard.wind,
      value: isToday
        ? `${Math.round(current.wind_speed_10m)} ${t.dashboard.windUnit}`
        : `${Math.round(daily.wind_speed_10m_max?.[index] ?? 0)} ${t.dashboard.windUnit}`,
    },
    {
      icon: '☀️',
      label: t.dashboard.uvIndex,
      value: isToday
        ? Math.round(current.uv_index)
        : Math.round(daily.uv_index_max?.[index] ?? 0),
    },
  ];

  return (
    <Card className={styles.dayDetail}>
      <Box className={styles.dayDetailHeader}>
        <Box className={styles.dayDetailLeft}>
          <Typography className={styles.dayDetailTitle}>{dateLabel}</Typography>
          <Typography variant="body2" color="text.secondary">{ws.label}</Typography>
        </Box>
        <Box className={styles.dayDetailWeather}>
          <Typography className={styles.emoji2}>{ws.emoji}</Typography>
          <Box className={styles.dayDetailTemps}>
            <Typography className={styles.dayDetailMax}>
              {toDisplay(daily.temperature_2m_max[index], unit)}°
            </Typography>
            <Typography variant="body2" color="text.secondary">
              / {toDisplay(daily.temperature_2m_min[index], unit)}°
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid className={styles.center} container spacing={1.5} sx={{ mt: 0.5 }}>
        {metrics.map((m) => (
          <Grid item xs={6} sm={3} key={m.label}>
            <MetricCard {...m} />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

// ── Main Dashboard View Component ─────────────────────────────────────────────
const DashboardView = ({ data, t, unit, onCityClick }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const todayMetrics = [
    { icon: '💨', label: t.dashboard.wind,       value: `${Math.round(data.current.wind_speed_10m)} ${t.dashboard.windUnit}` },
    { icon: '💧', label: t.dashboard.humidity,   value: `${data.current.relative_humidity_2m}%` },
    { icon: '☀️', label: t.dashboard.uvIndex,    value: Math.round(data.current.uv_index) },
    { icon: '👁',  label: t.dashboard.visibility, value: t.dashboard.visibilityVal },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} className={styles.grid}>

      {/* ── Left Column (Sticky Desktop Layout) ── */}
      <Grid item xs={12} md={4}>
        <Box className={styles.stickyCol}>
          <Stack spacing={2}>
            <MainWeatherCard current={data.current} unit={unit} t={t} />
            <Typography className={styles.sectionLabel}>
              {t.dashboard.popularCities}
            </Typography>
            {data.others.map((city) => (
              <CityCard
                key={city.nameEn}
                city={city}
                unit={unit}
                t={t}
                onClick={() => onCityClick(city.nameEn)}
              />
            ))}
          </Stack>
        </Box>
      </Grid>

      {/* ── Right Column ── */}
      <Grid item xs={12} md={8} className={styles.rightCol}>
        <Typography className={styles.sectionLabel}>
          {t.dashboard.todayMetrics}
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mb: { xs: 2.5, sm: 3 } }}>
          {todayMetrics.map((m) => (
            <Grid item xs={6} sm={3} key={m.label}>
              <MetricCard {...m} />
            </Grid>
          ))}
        </Grid>

        <Typography className={styles.sectionLabel}>
          {t.dashboard.weekForecast}
        </Typography>
        <WeekForecast
          daily={data.daily}
          t={t}
          unit={unit}
          onSelect={setSelectedDay}
          selectedIndex={selectedDay}
        />

        <Box sx={{ mt: 2 }}>
          <Typography className={styles.sectionLabel}>
            {t.dashboard.dayDetail ?? 'Day details'}
          </Typography>
          <DayDetail
            daily={data.daily}
            current={data.current}
            index={selectedDay}
            unit={unit}
            t={t}
          />
        </Box>
      </Grid>

    </Grid>
  );
};

export default DashboardView;