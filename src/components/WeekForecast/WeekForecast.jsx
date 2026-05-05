import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { getWeatherStyle } from '../../utils/weatherHelpers';
import styles from './WeekForecast.module.scss';

/**
 * Converts temperature from Celsius to the requested unit.
 * @param {number} celsius - Temperature in Celsius.
 * @param {'c' | 'f'} unit - Targeted display unit.
 * @returns {number} Converted and rounded temperature value.
 */
const toDisplay = (celsius, unit) =>
  unit === 'f' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);

/**
 * Renders a horizontal strip of cards representing the 7-day weather forecast.
 * Supports daily selection to preview distinct weather metrics.
 */
const WeekForecast = ({ daily, t, unit, onSelect, selectedIndex }) => (
  <Box className={styles.strip}>
    {daily.time.slice(0, 7).map((day, i) => {
      const ws = getWeatherStyle(daily.weather_code[i], t.weather);
      
      // Development console log for tracking parsed data and mapped styles
      console.log(`WeekForecast day=${i} date=${day} code=${daily.weather_code[i]} label=${ws.label}`);
      
      const isSelected = selectedIndex === i;
      return (
        <Card
          key={day}
          onClick={() => onSelect(i)}
          className={`${styles.card} ${i === 0 ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
          sx={{ cursor: 'pointer' }}
        >
          {/* Accent line indicator for the current day */}
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