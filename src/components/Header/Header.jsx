import React from 'react';
import { Box, Typography, IconButton, InputBase, Avatar } from '@mui/material';
import MenuIcon   from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import { translateCity } from '../../i18n/translations';
import styles from './Header.module.scss';

const Header = ({ activeTab, city, mode, onMenuOpen, onToggleTheme, isMobile, t }) => (
  <Box className={styles.header}>
    <Box className={styles.left}>
      {isMobile && (
        <IconButton onClick={onMenuOpen} size="small" className={styles.burgerBtn}>
          <MenuIcon fontSize="small" />
        </IconButton>
      )}
      <Box>
        <Typography className={styles.title}>{t.pageTitles[activeTab]}</Typography>
        <Typography variant="caption" color="text.secondary" className={styles.city}>
          📍 {translateCity(city, t)}
        </Typography>
      </Box>
    </Box>

    <Box className={styles.right}>
      {!isMobile && (
        <Box className={styles.searchBox}>
          <SearchIcon className={styles.searchIcon} />
          <InputBase
            placeholder={t.header.searchPlaceholder}
            fullWidth
            className={styles.searchInput}
          />
        </Box>
      )}
      <Box onClick={onToggleTheme} className={styles.themeToggle}>
        {mode === 'dark' ? '☀️' : '🌙'}
      </Box>
      <Avatar
        src="https://i.pravatar.cc/150?u=valentin"
        className={styles.avatar}
      />
    </Box>
  </Box>
);

export default Header;