import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, InputBase, Avatar, Drawer } from '@mui/material';
import MenuIcon   from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import { translateCity } from '../../i18n/translations';
import styles from './Header.module.scss';

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const STORAGE_KEY = 'weatherapp_users';
const SESSION_KEY = 'weatherapp_session';

/**
 * Retrieves the list of all registered users from LocalStorage.
 * @returns {Array} List of user objects.
 */
const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

/**
 * Saves the updated list of users to LocalStorage.
 * @param {Array} users - List of user objects to persist.
 */
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

/**
 * Retrieves the currently active session user.
 * @returns {Object|null} Active user data or null if not authenticated.
 */
const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

/**
 * Saves the current user session.
 * @param {Object} user - Authenticated user data.
 */
const saveSession = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));

/**
 * Clears the active user session from LocalStorage.
 */
const clearSession = () => localStorage.removeItem(SESSION_KEY);

// ── Auth Modal ────────────────────────────────────────────────────────────────
const AuthModal = ({ mode: authMode, themeMode, onClose, onSuccess }) => {
  const [view, setView] = useState(authMode); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Updates form field state dynamically
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  /**
   * Validates form inputs based on the active view.
   * @returns {Object} Key-value pairs of error messages.
   */
  const validate = () => {
    const errs = {};
    if (view === 'register' && !form.name.trim()) errs.name = "Введіть ім'я";
    if (!form.email.includes('@')) errs.email = 'Невірний email';
    if (form.password.length < 6) errs.password = 'Мінімум 6 символів';
    if (view === 'register' && form.password !== form.confirm) errs.confirm = 'Паролі не збігаються';
    return errs;
  };

  /**
   * Handles user login or registration form submission.
   */
  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    // Simulates network latency for a smoother user experience
    setTimeout(() => {
      const users = getUsers();
      if (view === 'login') {
        const user = users.find((u) => u.email === form.email && u.password === form.password);
        if (!user) { setErrors({ email: 'Невірний email або пароль' }); setLoading(false); return; }
        saveSession(user);
        onSuccess(user);
      } else {
        if (users.find((u) => u.email === form.email)) {
          setErrors({ email: 'Цей email вже зайнятий' }); setLoading(false); return;
        }
        const newUser = {
          id: Date.now(),
          name: form.name.trim(),
          email: form.email,
          password: form.password,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.email)}`,
          joinedAt: new Date().toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' }),
          unit: 'c',
          notifications: true,
        };
        saveUsers([...users, newUser]);
        saveSession(newUser);
        onSuccess(newUser);
      }
      setLoading(false);
    }, 600);
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${themeMode === 'light' ? 'theme-light' : 'theme-dark'}`}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        <div className={styles.modalTitle}>
          {view === 'login' ? '👋 З поверненням!' : '🌤️ Реєстрація'}
        </div>
        <div className={styles.modalSub}>
          {view === 'login'
            ? 'Введіть дані для входу в акаунт'
            : 'Створіть акаунт для повного доступу'}
        </div>

        {view === 'register' && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>ІМ'Я</label>
            <input
              className={`${styles.inputField} ${errors.name ? styles.error : ''}`}
              placeholder="Ваше ім'я"
              value={form.name}
              onChange={set('name')}
              onKeyDown={handleKey}
            />
            {errors.name && <div className={styles.errorMsg}>{errors.name}</div>}
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>EMAIL</label>
          <input
            className={`${styles.inputField} ${errors.email ? styles.error : ''}`}
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={set('email')}
            onKeyDown={handleKey}
          />
          {errors.email && <div className={styles.errorMsg}>{errors.email}</div>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>ПАРОЛЬ</label>
          <input
            className={`${styles.inputField} ${errors.password ? styles.error : ''}`}
            type="password"
            placeholder={view === 'register' ? 'Мінімум 6 символів' : '••••••••'}
            value={form.password}
            onChange={set('password')}
            onKeyDown={handleKey}
          />
          {errors.password && <div className={styles.errorMsg}>{errors.password}</div>}
        </div>

        {view === 'register' && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>ПІДТВЕРДІТЬ ПАРОЛЬ</label>
            <input
              className={`${styles.inputField} ${errors.confirm ? styles.error : ''}`}
              type="password"
              placeholder="Повторіть пароль"
              value={form.confirm}
              onChange={set('confirm')}
              onKeyDown={handleKey}
            />
            {errors.confirm && <div className={styles.errorMsg}>{errors.confirm}</div>}
          </div>
        )}

        <button
          className={styles.btnPrimary}
          onClick={handleSubmit}
          disabled={loading}
          style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '⏳ Завантаження…' : view === 'login' ? 'Увійти' : 'Зареєструватись'}
        </button>

        <div className={styles.modalSwitch}>
          {view === 'login' ? (
            <>Немає акаунту?{' '}
              <span className={styles.modalLink} onClick={() => { setView('register'); setErrors({}); setForm({ name: '', email: '', password: '', confirm: '' }); }}>
                Зареєструватись
              </span>
            </>
          ) : (
            <>Вже є акаунт?{' '}
              <span className={styles.modalLink} onClick={() => { setView('login'); setErrors({}); setForm({ name: '', email: '', password: '', confirm: '' }); }}>
                Увійти
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Profile Drawer ────────────────────────────────────────────────────────────
const ProfileDrawer = ({ open, onClose, t, user, onLogin, onRegister, onLogout, onUserUpdate, mode }) => {
  const [drawerTab, setDrawerTab] = useState('profile');
  const [editing, setEditing]     = useState(false);
  const [draft, setDraft]         = useState('');

  // Syncs user's current name with the edit draft input field
  useEffect(() => {
    if (user) setDraft(user.name);
  }, [user]);

  /**
   * Updates user name in both database/state and saves settings.
   */
  const handleSaveName = () => {
    if (!draft.trim()) return;
    const updated = { ...user, name: draft.trim() };
    const users = getUsers().map((u) => u.id === user.id ? updated : u);
    saveUsers(users);
    saveSession(updated);
    onUserUpdate(updated);
    setEditing(false);
  };

  /**
   * Clears the user session and resets the drawer layout.
   */
  const handleLogout = () => {
    clearSession();
    onLogout();
    onClose();
    setDrawerTab('profile');
  };

  const TABS = [
    { id: 'profile',       label: '👤 Профіль' },
    { id: 'notifications', label: '🔔 Сповіщення' },
    { id: 'settings',      label: '⚙️ Налаштування' },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ className: styles.drawerPaper }}
    >
      <div className={`${styles.drawerInner} ${mode === 'light' ? 'theme-light' : 'theme-dark'}`}>

        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>
            {!user ? '👤 Акаунт' : TABS.find((t) => t.id === drawerTab)?.label}
          </span>
          <button className={styles.drawerClose} onClick={onClose}>✕</button>
        </div>

        {/* ── UNAUTHORIZED USER CONTENT ── */}
        {!user && (
          <>
            <div className={styles.profileCard}>
              <div className={styles.guestAvatar}>👤</div>
              <div className={styles.profileName} style={{ fontSize: 16 }}>Ви не увійшли</div>
              <div className={styles.profileSub}>Увійдіть для повного доступу</div>
            </div>

            <div className={styles.authSection}>
              <button className={styles.btnPrimary} onClick={() => { onClose(); onLogin(); }}>
                Увійти в акаунт
              </button>
              <button className={styles.btnSecondary} onClick={() => { onClose(); onRegister(); }}>
                Створити акаунт
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.actionSection}>
              <button className={styles.actionBtn}>
                <span>ℹ️</span>
                <span>Що дає реєстрація?</span>
                <span className={styles.actionArrow}>›</span>
              </button>
            </div>
          </>
        )}

        {/* ── AUTHORIZED USER CONTENT ── */}
        {user && (
          <>
            {/* Navigation Tab Bar */}
            <div className={styles.tabBar}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${drawerTab === tab.id ? styles.active : ''}`}
                  onClick={() => setDrawerTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── TAB: PROFILE ── */}
            {drawerTab === 'profile' && (
              <>
                <div className={styles.profileCard}>
                  <div className={styles.avatarWrap}>
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className={styles.drawerAvatar}
                      onError={(e) => { e.target.src = `https://i.pravatar.cc/150?u=${user.email}`; }}
                    />
                    <div className={styles.avatarOnline} />
                  </div>

                  {editing ? (
                    <div className={styles.editRow}>
                      <input
                        className={styles.nameInput}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        autoFocus
                      />
                      <button className={styles.saveBtn} onClick={handleSaveName}>✓</button>
                    </div>
                  ) : (
                    <div className={styles.nameRow}>
                      <span className={styles.profileName}>{user.name}</span>
                      <button className={styles.editBtn} onClick={() => setEditing(true)}>✏️</button>
                    </div>
                  )}

                  <span className={styles.profileSub}>{user.email}</span>
                  <span className={styles.profileBadge}>Weather App користувач</span>
                </div>

                <div className={styles.infoSection}>
                  <div className={styles.sectionLabel}>ℹ️ Інформація</div>
                  <div className={styles.infoChip}>
                    <span>📅</span>
                    <span>Приєднався: {user.joinedAt}</span>
                  </div>
                  <div className={styles.infoChip}>
                    <span>🌍</span>
                    <span>Локація: Черкаси, UA</span>
                  </div>
                  <div className={styles.infoChip}>
                    <span>🌡️</span>
                    <span>Одиниці: {user.unit === 'f' ? '°F' : '°C'}</span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.actionSection}>
                  <button className={styles.actionBtn} onClick={() => setDrawerTab('settings')}>
                    <span>⚙️</span>
                    <span>Налаштування акаунту</span>
                    <span className={styles.actionArrow}>›</span>
                  </button>
                  <button className={styles.actionBtn} onClick={() => setDrawerTab('notifications')}>
                    <span>🔔</span>
                    <span>Сповіщення</span>
                    <span className={styles.actionArrow}>›</span>
                  </button>
                </div>

                <div className={styles.divider} />

                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <span>🚪</span>
                  <span>Вийти з акаунту</span>
                </button>
              </>
            )}

            {/* ── TAB: NOTIFICATIONS ── */}
            {drawerTab === 'notifications' && (
              <>
                <div className={styles.notifPanel}>
                  {[
                    { dot: '', text: 'Прогноз на завтра: очікується дощ після 15:00', time: '5 хв тому' },
                    { dot: 'warn', text: 'Вітер посилиться до 25 км/год ввечері', time: '1 год тому' },
                    { dot: 'success', text: 'Гарна погода для прогулянки сьогодні вранці!', time: 'Сьогодні, 08:00' },
                  ].map((n, i) => (
                    <div key={i} className={styles.notifItem}>
                      <div className={`${styles.notifDot} ${n.dot ? styles[n.dot] : ''}`} />
                      <div>
                        <div className={styles.notifText}>{n.text}</div>
                        <div className={styles.notifTime}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={styles.btnSecondary}>
                  Позначити всі як прочитані
                </button>
              </>
            )}

            {/* ── TAB: SETTINGS ── */}
            {drawerTab === 'settings' && (
              <>
                <div className={styles.settingsPanel}>
                  <div className={styles.settingsPanelTitle}>Акаунт</div>

                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}>Ім'я</span>
                    {editing ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input
                          className={styles.nameInput}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                          style={{ width: 110, fontSize: 13 }}
                        />
                        <button className={styles.saveBtn} onClick={handleSaveName} style={{ fontSize: 12, padding: '4px 8px' }}>✓</button>
                      </div>
                    ) : (
                      <span
                        style={{ fontSize: 13, color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                        onClick={() => setEditing(true)}
                      >
                        {user.name} ✏️
                      </span>
                    )}
                  </div>

                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}>Email</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{user.email}</span>
                  </div>
                </div>

                <div className={styles.settingsPanel}>
                  <div className={styles.settingsPanelTitle}>Відображення</div>
                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}>Температура</span>
                    <select
                      className={styles.selectSm}
                      value={user.unit}
                      onChange={(e) => {
                        const updated = { ...user, unit: e.target.value };
                        const users = getUsers().map((u) => u.id === user.id ? updated : u);
                        saveUsers(users);
                        saveSession(updated);
                        onUserUpdate(updated);
                      }}
                    >
                      <option value="c">°C Цельсій</option>
                      <option value="f">°F Фаренгейт</option>
                    </select>
                  </div>
                </div>

                <div className={styles.settingsPanel}>
                  <div className={styles.settingsPanelTitle}>Небезпечна зона</div>
                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}>Змінити пароль</span>
                    <span style={{ fontSize: 13, color: '#4facfe', cursor: 'pointer' }}>Змінити →</span>
                  </div>
                  <div className={styles.settingRow} style={{ border: 'none', paddingBottom: 0 }}>
                    <span className={styles.settingLabel}>Видалити акаунт</span>
                    <span
                      style={{ fontSize: 13, color: '#e24b4a', cursor: 'pointer' }}
                      onClick={() => {
                        if (window.confirm('Ви впевнені? Акаунт буде видалено назавжди.')) {
                          const users = getUsers().filter((u) => u.id !== user.id);
                          saveUsers(users);
                          handleLogout();
                        }
                      }}
                    >
                      Видалити →
                    </span>
                  </div>
                </div>

                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <span>🚪</span>
                  <span>Вийти з акаунту</span>
                </button>
              </>
            )}
          </>
        )}

        <div className={styles.drawerFooter}>Weather App · v2.1.0</div>
      </div>
    </Drawer>
  );
};

// ── Header ────────────────────────────────────────────────────────────────────
const Header = ({ activeTab, city, mode, onMenuOpen, onToggleTheme, isMobile, t, onSearch }) => {
  const [query,       setQuery]       = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [authModal,   setAuthModal]   = useState(null); // 'login' | 'register' | null
  const [user,        setUser]        = useState(() => getSession());

  /**
   * Executes search logic if input query is not empty.
   */
  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  /**
   * Handles state changes and opens the drawer when authentication succeeds.
   * @param {Object} loggedUser - Data of the successfully logged-in/registered user.
   */
  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
    setAuthModal(null);
    setProfileOpen(true);
  };

  return (
    <>
      <Box className={styles.header}>
        <Box className={styles.left}>
          {isMobile && (
            <IconButton onClick={onMenuOpen} size="small" className={styles.burgerBtn}>
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          <Box>
            <Typography className={styles.title}>{t.pageTitles[activeTab]}</Typography>
            <Typography variant="caption" className={styles.city}>
              📍 {translateCity(city, t)}
            </Typography>
          </Box>
        </Box>

        <Box className={styles.right}>
          {!isMobile && (
            <Box className={styles.searchBox}>
              <SearchIcon
                className={styles.searchIcon}
                onClick={handleSearch}
                style={{ cursor: 'pointer' }}
              />
              <InputBase
                placeholder={t.header.searchPlaceholder}
                fullWidth
                className={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Box>
          )}

          <Box onClick={onToggleTheme} className={styles.themeToggle}>
            {mode === 'dark' ? '☀️' : '🌙'}
          </Box>

          <Avatar
            src={user?.avatar || undefined}
            className={styles.avatar}
            onClick={() => setProfileOpen(true)}
            sx={{
              background: user ? undefined : 'linear-gradient(135deg, #4facfe, #00c6ff)',
              fontSize: '18px',
            }}
          >
            {!user && '👤'}
          </Avatar>
        </Box>
      </Box>

      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        t={t}
        user={user}
        mode={mode}
        onLogin={() => setAuthModal('login')}
        onRegister={() => setAuthModal('register')}
        onLogout={() => setUser(null)}
        onUserUpdate={(updated) => setUser(updated)}
      />

      {authModal && (
        <AuthModal
          mode={authModal}
          themeMode={mode}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default Header;