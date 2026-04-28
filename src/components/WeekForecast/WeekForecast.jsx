import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { getWeatherStyle } from '../../utils/weatherHelpers';
import styles from './WeekForecast.module.scss';

const toDisplay = (celsius, unit) =>
  unit === 'f' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);

const WeekForecast = ({ daily, t, unit }) => (
  <Box className={styles.strip}>
    {daily.time.slice(0, 7).map((day, i) => {
      const ws = getWeatherStyle(daily.weather_code[i], t.weather);
      return (
        <Card key={day} className={`${styles.card} ${i === 0 ? styles.today : ''}`}>
          {i === 0 && <Box className={styles.topLine} />}
          <Typography variant="caption" className={styles.dayLabel}>
            {i === 0
              ? t.dashboard.today
              : new Date(day).toLocaleDateString(t.locale, { weekday: 'short' })}
          </Typography>
          <Typography className={styles.emoji}>{ws.emoji}</Typography>
          <Typography variant="body2" className={styles.tempMax}>
            {toDisplay(daily.temperature_2m_max[i], unit)}°
          </Typography>
          <Typography variant="caption" color="text.secondary" className={styles.tempMin}>
            {toDisplay(daily.temperature_2m_min[i], unit)}°
          </Typography>
        </Card>
      );
    })}
  </Box>
);

export default WeekForecast;