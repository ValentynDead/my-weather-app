import React from 'react';
import { Box, Stack, IconButton, Typography } from '@mui/material';
import GridViewIcon      from '@mui/icons-material/GridView';
import MapIcon           from '@mui/icons-material/Map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon      from '@mui/icons-material/Settings';
import HelpOutlineIcon   from '@mui/icons-material/HelpOutlined';
import CloseIcon         from '@mui/icons-material/Close';

import { NAV_ITEMS } from '../../utils/constants';
import styles        from './Sidebar.module.scss';

// Mapping of navigation item IDs to their respective Material-UI icons
const NAV_ICONS = {
  dashboard: <GridViewIcon />,
  map:       <MapIcon />,
  calendar:  <CalendarMonthIcon />,
  settings:  <SettingsIcon />,
  help:      <HelpOutlineIcon />,
};

/**
 * Sidebar component providing primary navigation across application views.
 * Supports both persistent desktop layout and temporary mobile drawer view.
 */
const Sidebar = ({ activeTab, setActiveTab, onClose, isMobile, t }) => (
  <Box className={`${styles.sidebar} ${isMobile ? styles.mobile : styles.desktop}`}>

    {/* App logo visible only on desktop */}
    {!isMobile && <Box className={styles.logo} />}

    <Stack spacing={0.5} alignItems={isMobile ? 'flex-start' : 'center'} width="100%">
      {/* Mobile header containing the logo, menu label, and a close button */}
      {isMobile && (
        <Box className={styles.mobileHeader}>
          <Box className={styles.mobileLogoRow}>
            <Box className={styles.logo} />
            <Typography className={styles.menuLabel}>{t.nav.dashboard}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Dynamic mapping of the navigation menu items */}
      {NAV_ITEMS.map((item) => {
        const active = activeTab === item.id;
        return (
          <Box
            key={item.id}
            onClick={() => { setActiveTab(item.id); onClose?.(); }}
            className={`${styles.navItem} ${isMobile ? styles.navItemMobile : styles.navItemDesktop} ${active ? styles.active : ''}`}
          >
            {React.cloneElement(NAV_ICONS[item.id], { fontSize: 'small' })}
            
            {/* Display text labels next to icons only in mobile view */}
            {isMobile && (
              <Typography variant="body2" className={styles.navLabel}>
                {t.nav[item.id]}
              </Typography>
            )}
            
            {/* Visual indicator for the active navigation tab on desktop */}
            {active && !isMobile && <Box className={styles.activeIndicator} />}
          </Box>
        );
      })}
    </Stack>
  </Box>
);

export default Sidebar;