import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import styles from './HelpView.module.scss';

/**
 * Renders the Help and FAQ view component.
 * Displays a list of helpful resources, usage guides, or common questions.
 */
const HelpView = ({ t }) => {
  const ht = t.help;
  return (
    <Box className={styles.wrapper}>
      {/* Page Header and Titles */}
      <Typography className={styles.overline}>{ht.overline}</Typography>
      <Typography variant="h5" className={styles.title}>{ht.title}</Typography>

      {/* Dynamic list of FAQ/Help items */}
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