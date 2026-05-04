import React from 'react';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';

import MetricCard   from '../../components/MetricCard/MetricCard';
import WeekForecast from '../../components/WeekForecast/WeekForecast';
import { getWeatherStyle } from '../../utils/weatherHelpers';
import styles from './DashboardView.module.scss';

const toDisplay = (celsius, unit) =>
  unit === 'f' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);

const unitSymbol = (unit) => unit === 'f' ? '°F' : '°C';

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
        <Box className={styles.unitBadge}>{unitSymbol(unit)}</Box>
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
          <Typography variant="body2" color="text.secondary" className={styles.weatherLabel}>
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

const CityCard = ({ city, unit, t }) => {
  const cs = getWeatherStyle(city.code, t.weather);
  return (
    <Card className={styles.cityCard}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box className={styles.cityEmoji}>{cs.emoji}</Box>
        <Box>
          <Typography variant="body2" className={styles.cityName}>{city.name}</Typography>
          <Typography variant="caption" color="text.secondary">{city.country}</Typography>
        </Box>
      </Stack>
      <Typography className={styles.cityTemp}>
        {toDisplay(city.temp, unit)}°
      </Typography>
    </Card>
  );
};

const DashboardView = ({ data, t, unit }) => {
  const metrics = [
    { icon: '💨', label: t.dashboard.wind,       value: `${Math.round(data.current.wind_speed_10m)} ${t.dashboard.windUnit}` },
    { icon: '💧', label: t.dashboard.humidity,   value: `${data.current.relative_humidity_2m}%`  },
    { icon: '☀️', label: t.dashboard.uvIndex,    value: Math.round(data.current.uv_index)         },
    { icon: '👁',  label: t.dashboard.visibility, value: t.dashboard.visibilityVal                },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} className={styles.grid}>
      <Grid item xs={12} md={4}>
        <Stack spacing={2}>
          <MainWeatherCard current={data.current} unit={unit} t={t} />
          <Typography className={styles.sectionLabel}>{t.dashboard.popularCities}</Typography>
          {data.others.map((city) => (
            <CityCard key={city.name} city={city} unit={unit} t={t} />
          ))}
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Typography className={styles.sectionLabel}>{t.dashboard.todayMetrics}</Typography>
        <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
          {metrics.map((m) => (
            <Grid item xs={6} sm={3} key={m.label}>
              <MetricCard {...m} />
            </Grid>
          ))}
        </Grid>
        <Typography className={styles.sectionLabel}>{t.dashboard.weekForecast}</Typography>
        <WeekForecast daily={data.daily} t={t} unit={unit} />
      </Grid>
    </Grid>
  );
};

export default DashboardView;