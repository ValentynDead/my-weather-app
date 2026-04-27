import React, { useState } from 'react';

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      position: 'relative',
      width: 44,
      height: 26,
      cursor: 'pointer',
      background: checked
        ? 'linear-gradient(90deg, #4facfe, #00c6ff)'
        : 'rgba(255,255,255,0.08)',
      borderRadius: 13,
      transition: 'background 0.25s, box-shadow 0.25s',
      flexShrink: 0,
      border: checked ? '1px solid rgba(79,172,254,0.4)' : '1px solid rgba(255,255,255,0.12)',
      boxShadow: checked ? '0 2px 10px rgba(79,172,254,0.3)' : 'none',
    }}
  >
    <div style={{
      position: 'absolute',
      top: 3,
      left: checked ? 21 : 3,
      width: 18,
      height: 18,
      background: '#fff',
      borderRadius: '50%',
      transition: 'left 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    }} />
  </div>
);

const iconBgs = {
  '🌙': 'rgba(79,172,254,0.15)',
  '🌡️': 'rgba(239,159,39,0.15)',
  '🌐': 'rgba(147,131,236,0.15)',
  '🔔': 'rgba(91,184,50,0.15)',
  '⚡': 'rgba(239,159,39,0.15)',
  'ℹ️': 'rgba(79,172,254,0.15)',
  '📋': 'rgba(147,131,236,0.15)',
};

const iconColors = {
  '🌙': '#4facfe',
  '🌡️': '#ef9f27',
  '🌐': '#9383ec',
  '🔔': '#5AB832',
  '⚡': '#ef9f27',
  'ℹ️': '#4facfe',
  '📋': '#9383ec',
};

const Row = ({ icon, label, sub, control }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '14px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      transition: 'background 0.15s',
      cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 11,
      background: iconBgs[icon] || 'rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 17,
      flexShrink: 0,
      border: `1px solid ${(iconBgs[icon] || 'rgba(255,255,255,0.08)').replace('0.15', '0.25')}`,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.92)', fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
    </div>
    <div style={{ flexShrink: 0 }}>{control}</div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div style={{
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 18,
    marginBottom: '1rem',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 16px 10px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
      <span style={{
        fontSize: 11,
        fontWeight: 800,
        color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        {title}
      </span>
    </div>
    {children}
  </div>
);

const selectStyle = {
  fontSize: 13,
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 9,
  padding: '6px 10px',
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
  color: 'rgba(255,255,255,0.85)',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export const SettingsView = ({ isDark, onToggleTheme }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [rainAlert, setRainAlert] = useState(true);
  const [extremeAlert, setExtremeAlert] = useState(true);
  const [unit, setUnit] = useState('c');
  const [lang, setLang] = useState('uk');

  const handleDarkToggle = (val) => {
    setDarkMode(val);
    if (onToggleTheme) onToggleTheme();
  };

  const handleReset = () => {
    setDarkMode(true);
    setRainAlert(true);
    setExtremeAlert(true);
    setUnit('c');
    setLang('uk');
  };

  return (
    <div style={{
      padding: '0.5rem 0',
      maxWidth: 680,
      fontFamily: "'DM Sans', sans-serif",
      width: '100%',
    }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#4facfe',
          marginBottom: 5,
          fontWeight: 800,
          margin: '0 0 5px 0',
        }}>
          Конфігурація
        </p>
        <h2 style={{
          fontSize: 24,
          fontWeight: 900,
          margin: '0 0 4px 0',
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '-0.3px',
        }}>
          Налаштування
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Персоналізуйте свій досвід
        </p>
      </div>

      {/* Quick stats bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Тема', value: darkMode ? 'Темна' : 'Світла', icon: darkMode ? '🌙' : '☀️' },
          { label: 'Одиниці', value: unit === 'c' ? '°C' : '°F', icon: '🌡️' },
          { label: 'Мова', value: lang === 'uk' ? 'UA' : 'EN', icon: '🌐' },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 12px',
            borderRadius: 10,
            background: 'rgba(79,172,254,0.06)',
            border: '1px solid rgba(79,172,254,0.12)',
            fontSize: 12,
          }}>
            <span>{item.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{item.label}:</span>
            <span style={{ color: '#4facfe', fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}
      </div>

      <Section title="Зовнішній вигляд" icon="🎨">
        <Row
          icon="🌙"
          label="Темна тема"
          sub="Темні кольори для інтерфейсу"
          control={<Toggle checked={darkMode} onChange={handleDarkToggle} />}
        />
        <Row
          icon="🌡️"
          label="Одиниці вимірювання"
          sub="Шкала температури"
          control={
            <select
              style={selectStyle}
              value={unit}
              onChange={e => setUnit(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'rgba(79,172,254,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            >
              <option value="c">Цельсій °C</option>
              <option value="f">Фаренгейт °F</option>
            </select>
          }
        />
        <Row
          icon="🌐"
          label="Мова системи"
          sub="Мова інтерфейсу та прогнозів"
          control={
            <select
              style={selectStyle}
              value={lang}
              onChange={e => setLang(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'rgba(79,172,254,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            >
              <option value="uk">🇺🇦 Українська</option>
              <option value="en">🇬🇧 English</option>
            </select>
          }
        />
      </Section>

      <Section title="Сповіщення" icon="🔔">
        <Row
          icon="🔔"
          label="Сповіщення про дощ"
          sub="Нагадування за 1 год до опадів"
          control={<Toggle checked={rainAlert} onChange={setRainAlert} />}
        />
        <Row
          icon="⚡"
          label="Екстремальна погода"
          sub="Попередження про шторм, сильний мороз"
          control={<Toggle checked={extremeAlert} onChange={setExtremeAlert} />}
        />
      </Section>

      <Section title="Про застосунок" icon="ℹ️">
        <Row
          icon="ℹ️"
          label="Версія застосунку"
          sub="Остання доступна версія"
          control={
            <span style={{
              fontSize: 12,
              color: '#4facfe',
              background: 'rgba(79,172,254,0.1)',
              border: '1px solid rgba(79,172,254,0.2)',
              borderRadius: 7,
              padding: '3px 10px',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}>
              v2.1.0
            </span>
          }
        />
        <Row
          icon="📋"
          label="Ліцензія та дані"
          sub="Open-Meteo API • OSM"
          control={
            <button
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9,
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
              }}
            >
              Детальніше →
            </button>
          }
        />
      </Section>

      {/* Reset button */}
      <button
        onClick={handleReset}
        style={{
          width: '100%',
          padding: '13px',
          background: 'transparent',
          border: '1px solid rgba(226,75,74,0.35)',
          color: '#E24B4A',
          borderRadius: 16,
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          transition: 'all 0.18s',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(226,75,74,0.07)';
          e.currentTarget.style.borderColor = 'rgba(226,75,74,0.6)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(226,75,74,0.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(226,75,74,0.35)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span>↺</span>
        Скинути всі налаштування до заводських
      </button>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}>
        <span>☁️</span>
        <span>Погода · v2.1.0 · Дані: open-meteo.com</span>
        <span>☁️</span>
      </div>
    </div>
  );
};