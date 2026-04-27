import React, { useState } from 'react';

const months = [
  'Січня','Лютого','Березня','Квітня','Травня','Червня',
  'Липня','Серпня','Вересня','Жовтня','Листопада','Грудня',
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 600);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

// Перетворює weather_code у емодзі + опис + клас
const getWeatherInfo = (code) => {
  if (code === 0)                        return { icon: '☀️', desc: 'Ясно та сонячно',       cls: 'good' };
  if (code >= 1 && code <= 2)            return { icon: '🌤️', desc: 'Переважно сонячно',     cls: 'good' };
  if (code === 3)                        return { icon: '☁️', desc: 'Хмарно',                cls: '' };
  if (code >= 45 && code <= 48)          return { icon: '🌫️', desc: 'Туман',                 cls: '' };
  if (code >= 51 && code <= 55)          return { icon: '🌦️', desc: 'Мряка',                 cls: 'rain' };
  if (code >= 61 && code <= 65)          return { icon: '🌧️', desc: 'Дощовий день',          cls: 'rain' };
  if (code >= 71 && code <= 77)          return { icon: '❄️', desc: 'Сніг',                  cls: 'rain' };
  if (code >= 80 && code <= 82)          return { icon: '🌦️', desc: 'Можливий легкий дощ',  cls: 'rain' };
  if (code >= 95 && code <= 99)          return { icon: '⛈️', desc: 'Гроза',                 cls: 'rain' };
  return { icon: '⛅', desc: 'Мінлива хмарність', cls: '' };
};

export const CalendarView = ({ data }) => {
  const today = new Date();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(0);
  const isMobile = useIsMobile();

  // daily містить масиви на 7 днів від Open-Meteo
  const daily = data?.daily;
  const days = daily ? daily.time.length : 0;

  const getDay = (i) => {
    if (!daily || i >= days) return null;
    const code = daily.weather_code[i];
    const info = getWeatherInfo(code);
    return {
      icon:    info.icon,
      desc:    info.desc,
      cls:     info.cls,
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
    };
  };

  // Показуємо 14 карток: реальні дані де є, далі — заглушка
  const TOTAL = 14;

  return (
    <div style={{ padding: isMobile ? '0' : '0.5rem 0', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'flex-end',
        justifyContent: 'space-between',
        marginBottom: isMobile ? '1.25rem' : '1.75rem',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <p style={{
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#4facfe', marginBottom: 5, fontWeight: 800, margin: '0 0 5px 0',
          }}>Прогноз погоди</p>
          <h2 style={{
            fontSize: isMobile ? 20 : 24, fontWeight: 900,
            margin: '0 0 4px 0', lineHeight: 1.1, letterSpacing: '-0.3px',
          }}>Планувальник</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Прогноз на {days} днів вперед
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(79,172,254,0.08)',
          border: '1px solid rgba(79,172,254,0.2)',
          borderRadius: 30,
          padding: isMobile ? '5px 12px' : '7px 16px',
          fontSize: isMobile ? 12 : 13,
          color: '#4facfe', fontWeight: 600, flexShrink: 0,
        }}>
          <span>📅</span>
          <span>{today.getDate()} {months[today.getMonth()]}</span>
        </div>
      </div>

      {/* Selected day detail panel */}
      {(() => {
        const d = new Date(today);
        d.setDate(today.getDate() + selected);
        const day = getDay(selected);
        if (!day) return null;
        const { icon, desc, cls, tempMax, tempMin } = day;
        const descColor = cls === 'good' ? '#5AB832' : cls === 'rain' ? '#4facfe' : 'rgba(255,255,255,0.5)';
        return (
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,172,254,0.1) 0%, rgba(0,198,255,0.04) 100%)',
            border: '1px solid rgba(79,172,254,0.25)',
            borderRadius: 20,
            padding: isMobile ? '16px' : '20px 24px',
            marginBottom: isMobile ? '1.25rem' : '1.75rem',
            display: 'flex', alignItems: 'center',
            gap: isMobile ? 16 : 24,
            flexWrap: 'wrap',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%',
              height: 2,
              background: 'linear-gradient(90deg, transparent, #4facfe, transparent)',
            }} />
            <div style={{
              fontSize: isMobile ? 42 : 56, lineHeight: 1,
              filter: 'drop-shadow(0 4px 12px rgba(79,172,254,0.3))',
            }}>{icon}</div>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 800, color: '#4facfe',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
              }}>
                {selected === 0 ? 'Сьогодні' : selected === 1 ? 'Завтра'
                  : d.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div style={{
                fontSize: isMobile ? 32 : 40, fontWeight: 900,
                color: '#fff', lineHeight: 1, letterSpacing: '-1px',
              }}>
                {tempMax}°
                <span style={{ fontSize: isMobile ? 16 : 20, color: 'rgba(255,255,255,0.4)', marginLeft: 6, fontWeight: 500 }}>
                  / {tempMin}°
                </span>
              </div>
            </div>
            {desc && (
              <div style={{
                marginLeft: 'auto',
                padding: '6px 14px', borderRadius: 20,
                background: cls === 'good' ? 'rgba(91,184,50,0.12)' : cls === 'rain' ? 'rgba(79,172,254,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${cls === 'good' ? 'rgba(91,184,50,0.25)' : cls === 'rain' ? 'rgba(79,172,254,0.2)' : 'rgba(255,255,255,0.08)'}`,
                fontSize: 13, fontWeight: 600, color: descColor,
              }}>{desc}</div>
            )}
          </div>
        );
      })()}

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? 'repeat(auto-fill, minmax(100px, 1fr))'
          : 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: isMobile ? 8 : 10,
      }}>
        {Array.from({ length: TOTAL }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          const isToday    = i === 0;
          const isTomorrow = i === 1;
          const isSelected = selected === i;
          const isHovered  = hovered === i;
          const day = getDay(i);

          // Якщо реальних даних немає — прихована картка
          const hasData = !!day;
          const { icon, desc, cls, tempMax, tempMin } = day || {};

          const weekday = d.toLocaleDateString('uk-UA', { weekday: 'short' });
          const dateStr  = d.getDate() + ' ' + months[d.getMonth()].slice(0, 3);
          const descColor = cls === 'good' ? '#5AB832' : cls === 'rain' ? '#4facfe' : 'rgba(255,255,255,0.35)';

          let bgStyle, borderColor;
          if (isSelected) {
            bgStyle = 'linear-gradient(160deg, rgba(79,172,254,0.22) 0%, rgba(79,172,254,0.08) 100%)';
            borderColor = 'rgba(79,172,254,0.7)';
          } else if (isToday) {
            bgStyle = 'linear-gradient(160deg, rgba(79,172,254,0.12) 0%, rgba(79,172,254,0.04) 100%)';
            borderColor = 'rgba(79,172,254,0.4)';
          } else if (isHovered) {
            bgStyle = 'rgba(255,255,255,0.06)';
            borderColor = 'rgba(255,255,255,0.18)';
          } else {
            bgStyle = hasData ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)';
            borderColor = hasData ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)';
          }

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => hasData && setSelected(i)}
              style={{
                background: bgStyle,
                border: `1px solid ${borderColor}`,
                borderRadius: isMobile ? 14 : 18,
                padding: isMobile ? '12px 8px' : '16px 12px',
                cursor: hasData ? 'pointer' : 'default',
                opacity: hasData ? 1 : 0.35,
                transform: (isHovered && !isSelected && hasData) ? 'translateY(-4px)' : isSelected ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                boxShadow: isSelected
                  ? '0 8px 24px rgba(79,172,254,0.2)'
                  : isHovered && hasData ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: isMobile ? 5 : 7,
                textAlign: 'center', position: 'relative', overflow: 'hidden',
              }}
            >
              {(isToday || isSelected) && (
                <div style={{
                  position: 'absolute', top: 0, left: '15%', right: '15%',
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #4facfe, transparent)',
                }} />
              )}

              {(isToday || isTomorrow) && (
                <div style={{
                  fontSize: isMobile ? 9 : 10, fontWeight: 800,
                  background: isToday ? 'rgba(79,172,254,0.2)' : 'rgba(255,255,255,0.08)',
                  color: isToday ? '#4facfe' : 'rgba(255,255,255,0.5)',
                  borderRadius: 20, padding: '2px 8px',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {isToday ? 'Сьогодні' : 'Завтра'}
                </div>
              )}

              <div style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>
                {!isToday && !isTomorrow && (
                  <span style={{
                    display: 'block', fontWeight: 700,
                    color: 'rgba(255,255,255,0.6)', marginBottom: 1,
                    fontSize: isMobile ? 11 : 12,
                  }}>{weekday}</span>
                )}
                <span style={{ fontSize: isMobile ? 9 : 11 }}>{dateStr}</span>
              </div>

              {hasData ? (
                <>
                  <div style={{
                    fontSize: isMobile ? 26 : 32, lineHeight: 1,
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                    transition: 'transform 0.2s',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  }}>{icon}</div>

                  <div>
                    <div style={{
                      fontSize: isMobile ? 17 : 21, fontWeight: 900,
                      color: '#fff', lineHeight: 1, letterSpacing: '-0.5px',
                    }}>{tempMax}°</div>
                    <div style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                      {tempMin}° мін
                    </div>
                  </div>

                  {desc && !isMobile && (
                    <div style={{ fontSize: 11, color: descColor, lineHeight: 1.4, fontWeight: 600 }}>
                      {desc}
                    </div>
                  )}

                  {desc && isMobile && (
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: cls === 'good' ? '#5AB832' : cls === 'rain' ? '#4facfe' : 'rgba(255,255,255,0.2)',
                    }} />
                  )}
                </>
              ) : (
                <div style={{ fontSize: isMobile ? 18 : 22, color: 'rgba(255,255,255,0.15)' }}>—</div>
              )}
            </div>
          );
        })}
      </div>

      {isMobile && (
        <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['#5AB832','Гарна погода'],['#4facfe','Дощ'],['rgba(255,255,255,0.3)','Хмарно']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};// For mentor review