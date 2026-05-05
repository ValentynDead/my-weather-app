import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './SettingsView.module.scss';

// ── Custom UI Components ─────────────────────────────────────────────────────

/**
 * Custom toggle switch component.
 */
const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
  >
    <div className={`${styles.toggleKnob} ${checked ? styles.toggleKnobOn : ''}`} />
  </div>
);

/**
 * Custom dropdown select component with support for portals to avoid CSS clipping.
 */
const CustomSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);

  // Close dropdown on clicking outside or on scrolling
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    window.addEventListener('scroll', () => setOpen(false), { once: true });
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /**
   * Recalculates screen position before rendering the portal.
   */
  const handleOpen = () => {
    if (open) { setOpen(false); return; }
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    setOpen(true);
  };

  const current = options.find((o) => o.value === value);

  const dropdown = (
    <div
      className={styles.selectDropdown}
      style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <div
            key={opt.value}
            className={`${styles.selectOption} ${isSelected ? styles.selectOptionActive : ''}`}
            onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
          >
            <span>{opt.label}</span>
            <span className={styles.selectCheck}>{isSelected ? '✓' : ''}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.customSelect}>
      <button
        ref={btnRef}
        className={`${styles.selectBtn} ${open ? styles.selectBtnOpen : ''}`}
        onClick={handleOpen}
        type="button"
      >
        <span>{current?.label}</span>
        <span className={`${styles.selectArrow} ${open ? styles.selectArrowOpen : ''}`}>▼</span>
      </button>
      {open && createPortal(dropdown, document.querySelector('.app-layout') ?? document.body)}
    </div>
  );
};

const Row = ({ icon, label, sub, control }) => (
  <div className={styles.row}>
    <div className={styles.rowIcon}>{icon}</div>
    <div className={styles.rowText}>
      <div className={styles.rowLabel}>{label}</div>
      <div className={styles.rowSub}>{sub}</div>
    </div>
    <div className={styles.rowControl}>{control}</div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      {icon && <span>{icon}</span>}
      <span className={styles.sectionTitle}>{title}</span>
    </div>
    {children}
  </div>
);

// ── License Modal ─────────────────────────────────────────────────────────────

/**
 * Renders the license terms inside a React portal.
 */
const LicenseModal = ({ onClose }) =>
  createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span>📋 Ліцензія</span>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalTitle}>MIT License</p>
          <p className={styles.modalText}>
            Copyright © {new Date().getFullYear()} Weather App
          </p>
          <p className={styles.modalText}>
            Дозволяється безкоштовно використовувати, копіювати, змінювати,
            об'єднувати, публікувати, розповсюджувати, ліцензувати та/або
            продавати копії цього програмного забезпечення за умови збереження
            цього повідомлення в усіх копіях.
          </p>
          <p className={styles.modalText}>
            ПРОГРАМНЕ ЗАБЕЗПЕЧЕННЯ НАДАЄТЬСЯ «ЯК Є», БЕЗ ЖОДНИХ ГАРАНТІЙ,
            ЯВНИХ АБО НЕЯВНИХ, ВКЛЮЧАЮЧИ, АЛЕ НЕ ОБМЕЖУЮЧИСЬ ГАРАНТІЯМИ
            ПРИДАТНОСТІ ДЛЯ ПЕВНОЇ МЕТИ ТА НЕНАРУШЕННЯ ПРАВ.
          </p>
        </div>
        <button className={styles.modalBtn} onClick={onClose}>Закрити</button>
      </div>
    </div>,
    document.querySelector('.app-layout') ?? document.body
  );

// ── Web Notification Utilities ────────────────────────────────────────────────

/**
 * Triggers a native system notification through the browser API.
 */
const sendWeatherNotification = (title, body) => {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'weather-update',
  });
};

/**
 * Requests browser permission before triggering notification callbacks.
 */
const requestAndNotify = async (onGranted, onDenied) => {
  if (Notification.permission === 'granted') { onGranted(); return; }
  if (Notification.permission === 'denied')  { onDenied();  return; }
  const result = await Notification.requestPermission();
  if (result === 'granted') onGranted();
  else onDenied();
};

// ── Main Settings View Component ──────────────────────────────────────────────
const SettingsView = ({ isDark, onToggleTheme, lang, onLangChange, unit, onUnitChange, t, weatherData }) => {
  const st = t.settings;

  const [weatherAlert, setWeatherAlert] = useState(() => {
    const saved = localStorage.getItem('weatherAlert');
    return saved !== null ? saved === 'true' : false;
  });
  const [extremeAlert, setExtremeAlert] = useState(() => {
    const saved = localStorage.getItem('extremeAlert');
    return saved !== null ? saved === 'true' : false;
  });
  const [showLicense, setShowLicense] = useState(false);

  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  // ── Sync with browser permission status every 2 seconds ─────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof Notification !== 'undefined') {
        setPermissionStatus(Notification.permission);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ── Triggers weather updates every 30 minutes if notifications are enabled ──
  useEffect(() => {
    if (!weatherAlert || permissionStatus !== 'granted') return;

    const sendUpdate = () => {
      const temp = weatherData?.current?.temperature_2m;
      const city = weatherData?.city ?? '';
      const code = weatherData?.current?.weather_code;

      const weatherLabels = {
        0: '☀️ Ясно',
        1: '🌤️ Переважно ясно', 2: '⛅ Мінлива хмарність', 3: '☁️ Хмарно',
        45: '🌫️ Туман', 48: '🌫️ Туман з інеєм',
        51: '🌦️ Мряка', 53: '🌦️ Мряка', 55: '🌦️ Густа мряка',
        61: '🌧️ Дощ', 63: '🌧️ Помірний дощ', 65: '🌧️ Сильний дощ',
        71: '🌨️ Сніг', 73: '🌨️ Помірний сніг', 75: '🌨️ Сильний сніг',
        80: '🌦️ Злива', 81: '🌦️ Помірна злива', 82: '⛈️ Сильна злива',
        95: '⛈️ Гроза', 96: '⛈️ Гроза з градом', 99: '⛈️ Сильна гроза',
      };

      const label = weatherLabels[code] ?? '🌡️ Оновлення погоди';
      const body  = temp != null
        ? `${city ? city + ' · ' : ''}${label.split(' ').slice(1).join(' ')} · ${Math.round(temp)}°`
        : label;

      sendWeatherNotification('🌤️ Погода зараз', body);
    };

    sendUpdate();
    const interval = setInterval(sendUpdate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherAlert, permissionStatus, weatherData]);

  // ── Evaluates extreme weather conditions every 10 minutes ───────────────────
  useEffect(() => {
    if (!extremeAlert || permissionStatus !== 'granted') return;

    const checkExtreme = () => {
      const code = weatherData?.current?.weather_code;
      const extremeCodes = [65, 75, 82, 95, 96, 99];
      if (extremeCodes.includes(code)) {
        const city = weatherData?.city ?? '';
        sendWeatherNotification(
          '⚠️ Екстремальна погода',
          `${city ? city + ' · ' : ''}Небезпечні погодні умови! Будьте обережні.`
        );
      }
    };

    checkExtreme();
    const interval = setInterval(checkExtreme, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [extremeAlert, permissionStatus, weatherData]);

  /**
   * Toggles regular weather alerts and requests browser permissions if necessary.
   */
  const handleWeatherAlert = (val) => {
    if (val) {
      requestAndNotify(
        () => { setWeatherAlert(true); localStorage.setItem('weatherAlert', 'true'); },
        () => alert('Дозвольте сповіщення в налаштуваннях браузера')
      );
    } else {
      setWeatherAlert(false);
      localStorage.setItem('weatherAlert', 'false');
    }
  };

  /**
   * Toggles severe/extreme weather alerts and evaluates conditions.
   */
  const handleExtremeAlert = (val) => {
    if (val) {
      requestAndNotify(
        () => { setExtremeAlert(true); localStorage.setItem('extremeAlert', 'true'); },
        () => alert('Дозвольте сповіщення в налаштуваннях браузера')
      );
    } else {
      setExtremeAlert(false);
      localStorage.setItem('extremeAlert', 'false');
    }
  };

  /**
   * Resets all visual and application settings back to defaults.
   */
  const handleReset = () => {
    if (!isDark) onToggleTheme?.();
    localStorage.setItem('theme', 'dark');
    onUnitChange('c');
    onLangChange('uk');
    setWeatherAlert(false);
    setExtremeAlert(false);
    localStorage.setItem('weatherAlert', 'false');
    localStorage.setItem('extremeAlert', 'false');
  };

  const unitOptions = [
    { value: 'c', label: st.celsius    || 'Celsius °C'    },
    { value: 'f', label: st.fahrenheit || 'Fahrenheit °F' },
  ];
  const langOptions = [
    { value: 'uk', label: st.langUk || 'UA Українська' },
    { value: 'en', label: st.langEn || 'EN English'    },
  ];

  const quickStats = [
    { label: st.theme,    value: isDark ? st.dark : st.light, icon: isDark ? '🌙' : '☀️' },
    { label: st.units,    value: unit === 'c' ? '°C' : '°F',  icon: '🌡️' },
    { label: st.language, value: lang === 'uk' ? 'UA' : 'EN', icon: '🌐' },
  ];

  const notifBlocked = permissionStatus === 'denied';

  return (
    <div className={styles.wrapper}>
      {showLicense && <LicenseModal onClose={() => setShowLicense(false)} />}

      <div className={styles.header}>
        <p className={styles.overline}>{st.overline}</p>
        <h2 className={styles.title}>{st.title}</h2>
        <p className={styles.subtitle}>{st.subtitle}</p>
      </div>

      <div className={styles.statsRow}>
        {quickStats.map((item) => (
          <div key={item.label} className={styles.statChip}>
            <span>{item.icon}</span>
            <span className={styles.statLabel}>{item.label}:</span>
            <span className={styles.statValue}>{item.value}</span>
          </div>
        ))}
      </div>

      <Section title={st.appearance} icon="🎨">
        <Row icon="🌙" label={st.darkTheme} sub={st.darkThemeSub}
          control={<Toggle checked={isDark} onChange={() => onToggleTheme?.()} />} />
        <Row icon="🌡️" label={st.unitLabel} sub={st.unitSub}
          control={<CustomSelect value={unit} onChange={onUnitChange} options={unitOptions} />} />
        <Row icon="🌐" label={st.langLabel} sub={st.langSub}
          control={<CustomSelect value={lang} onChange={onLangChange} options={langOptions} />} />
      </Section>

      <Section title={st.notifications} icon="🔔">
        {notifBlocked && (
          <div className={styles.notifWarning}>
            ⚠️ Сповіщення заблоковані браузером. Дозвольте їх у налаштуваннях браузера.
          </div>
        )}
        <Row icon="🌤️" label="Погода зараз"
          sub="Оновлення погоди кожні 30 хвилин"
          control={<Toggle checked={weatherAlert} onChange={handleWeatherAlert} />} />
        <Row icon="⚡" label={st.extremeAlert} sub={st.extremeAlertSub}
          control={<Toggle checked={extremeAlert} onChange={handleExtremeAlert} />} />
      </Section>

      <Section title={st.about} icon="ℹ️">
        <Row icon="ℹ️" label={st.version} sub={st.versionSub}
          control={<span className={styles.versionBadge}>v2.1.0</span>} />
        <Row icon="📋" label={st.license} sub={st.licenseSub}
          control={
            <button className={styles.detailsBtn} onClick={() => setShowLicense(true)}>
              {st.details}
            </button>
          }
        />
      </Section>

      <button onClick={handleReset} className={styles.resetBtn}>
        <span>↺</span> {st.reset}
      </button>

      <div className={styles.footer}>
        <span>☁️</span><span>{st.footer}</span><span>☁️</span>
      </div>
    </div>
  );
};

export default SettingsView;