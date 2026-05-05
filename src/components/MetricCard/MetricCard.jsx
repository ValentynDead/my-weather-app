import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import styles from './MetricCard.module.scss';

/**
 * MetricCard component displays individual weather indicators.
 * Used for showing specific data points like wind speed, humidity, UV index, etc.
 */
const MetricCard = ({ icon, label, value }) => (
  <Card className={styles.card}>
    {/* Visual indicator / Emoji */}
    <Typography className={styles.icon}>{icon}</Typography>
    
    {/* Metric subtitle or description */}
    <Typography variant="caption" color="text.secondary" className={styles.label}>
      {label}
    </Typography>
    
    {/* Current metric value */}
    <Typography variant="h6" className={styles.value}>
      {value}
    </Typography>
  </Card>
);

export default MetricCard;