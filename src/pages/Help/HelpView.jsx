import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import styles from './HelpView.module.scss';

const HelpView = ({ t }) => {
  const ht = t.help;
  return (
    <Box className={styles.wrapper}>
      <Typography className={styles.overline}>{ht.overline}</Typography>
      <Typography variant="h5" className={styles.title}>{ht.title}</Typography>

      {ht.items.map((item) => (
        <Card key={item.title} className={styles.card}>
          <Box className={styles.iconBox}>{item.icon}</Box>
          <Box>
            <Typography className={styles.itemTitle}>{item.title}</Typography>
            <Typography color="text.secondary" className={styles.itemDesc}>{item.desc}</Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default HelpView;