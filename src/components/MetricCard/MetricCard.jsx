import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import styles from './MetricCard.module.scss';

const MetricCard = ({ icon, label, value }) => (
  <Card className={styles.card}>
    <Typography className={styles.icon}>{icon}</Typography>
    <Typography variant="caption" color="text.secondary" className={styles.label}>
      {label}
    </Typography>
    <Typography variant="h6" className={styles.value}>
      {value}
    </Typography>
  </Card>
);

export default MetricCard;