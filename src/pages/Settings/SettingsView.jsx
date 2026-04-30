import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './SettingsView.module.scss';

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
  >
    <div className={`${styles.toggleKnob} ${checked ? styles.toggleKnobOn : ''}`} />
  </div>
);

const CustomSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    window.addEventListener('scroll', () => setOpen(false), { once: true });
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleOpen = () => {
    if (open) { setOpen(false); return; }
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top:   rect.bottom + 8,
      left:  rect.left,
      width: rect.width,
    });
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
            onMouseDown={(e) => {
              e.preventDefault();
              onChange(opt.value);
              setOpen(false);
            }}
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

      {open && createPortal(dropdown, document.body)}
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

// ─────────────────────────────────────────────────────────────────────────────
// Пропси:
//   isDark        — boolean, приходить з WeatherApp (mode === 'dark')
//   onToggleTheme — перемикає тему в батьку + зберігає в localStorage
//   lang, onLangChange, unit, onUnitChange — аналогічно
// ─────────────────────────────────────────────────────────────────────────────
const SettingsView = ({ isDark, onToggleTheme, lang, onLangChange, unit, onUnitChange, t }) => {
  const st = t.settings;

  // Сповіщення — зберігаємо локально + в localStorage
  const [rainAlert, setRainAlert] = useState(() => {
    const saved = localStorage.getItem('rainAlert');
    return saved !== null ? saved === 'true' : true;
  });
  const [extremeAlert, setExtremeAlert] = useState(() => {
    const saved = localStorage.getItem('extremeAlert');
    return saved !== null ? saved === 'true' : true;
  });

  const handleRainAlert = (val) => {
    setRainAlert(val);
    localStorage.setItem('rainAlert', String(val));
  };

  const handleExtremeAlert = (val) => {
    setExtremeAlert(val);
    localStorage.setItem('extremeAlert', String(val));
  };

  // Скидання до дефолту
  const handleReset = () => {
    // Тема → темна: якщо зараз світла — перемикаємо
    if (!isDark) onToggleTheme?.();
    localStorage.setItem('theme', 'dark');

    onUnitChange('c');
    localStorage.setItem('unit', 'c');

    onLangChange('uk');
    localStorage.setItem('lang', 'uk');

    handleRainAlert(true);
    handleExtremeAlert(true);
  };

  const unitOptions = [
    { value: 'c', label: st.celsius    || 'Celsius °C'    },
    { value: 'f', label: st.fahrenheit || 'Fahrenheit °F' },
  ];

  const langOptions = [
    { value: 'uk', label: st.langUk || 'UA Українська' },
    { value: 'en', label: st.langEn || 'EN English'    },
  ];

  // isDark замість локального darkMode — завжди синхронізовано з батьком
  const quickStats = [
    { label: st.theme,    value: isDark ? st.dark : st.light, icon: isDark ? '🌙' : '☀️' },
    { label: st.units,    value: unit === 'c' ? '°C' : '°F',  icon: '🌡️' },
    { label: st.language, value: lang === 'uk' ? 'UA' : 'EN', icon: '🌐' },
  ];

  return (
    <div className={styles.wrapper}>
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
        <Row
          icon="🌙"
          label={st.darkTheme}
          sub={st.darkThemeSub}
          control={<Toggle checked={isDark} onChange={() => onToggleTheme?.()} />}
        />
        <Row
          icon="🌡️"
          label={st.unitLabel}
          sub={st.unitSub}
          control={<CustomSelect value={unit} onChange={onUnitChange} options={unitOptions} />}
        />
        <Row
          icon="🌐"
          label={st.langLabel}
          sub={st.langSub}
          control={<CustomSelect value={lang} onChange={onLangChange} options={langOptions} />}
        />
      </Section>

      <Section title={st.notifications} icon="🔔">
        <Row
          icon="🔔"
          label={st.rainAlert}
          sub={st.rainAlertSub}
          control={<Toggle checked={rainAlert} onChange={handleRainAlert} />}
        />
        <Row
          icon="⚡"
          label={st.extremeAlert}
          sub={st.extremeAlertSub}
          control={<Toggle checked={extremeAlert} onChange={handleExtremeAlert} />}
        />
      </Section>

      <Section title={st.about} icon="ℹ️">
        <Row
          icon="ℹ️"
          label={st.version}
          sub={st.versionSub}
          control={<span className={styles.versionBadge}>v2.1.0</span>}
        />
        <Row
          icon="📋"
          label={st.license}
          sub={st.licenseSub}
          control={<button className={styles.detailsBtn}>{st.details}</button>}
        />
      </Section>

      <button onClick={handleReset} className={styles.resetBtn}>
        <span>↺</span>
        {st.reset}
      </button>

      <div className={styles.footer}>
        <span>☁️</span>
        <span>{st.footer}</span>
        <span>☁️</span>
      </div>
    </div>
  );
};

export default SettingsView;