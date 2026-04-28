import React, { useState } from 'react';

import { useIsMobile }    from '../../hooks/useIsMobile';
import { getWeatherInfo } from '../../utils/weatherHelpers';
import { MONTHS }         from '../../utils/constants';
import styles             from './CalendarView.module.scss';

const TOTAL_CARDS = 14;

const MONTHS_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const toDisplay = (celsius, unit) =>
  unit === 'f' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);

const DayDetail = ({ dayIndex, day, isMobile, t }) => {
  if (!day) return null;
  const ct    = t.calendar;
  const today = new Date();
  const date  = new Date(today);
  date.setDate(today.getDate() + dayIndex);

  const { icon, desc, cls, tempMax, tempMin } = day;

  const descColor =
    cls === 'good' ? '#5AB832' :
    cls === 'rain' ? '#4facfe' :
    'rgba(128,128,128,0.7)';

  const labelText =
    dayIndex === 0 ? ct.today :
    dayIndex === 1 ? ct.tomorrow :
    date.toLocaleDateString(t.locale, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={styles.detail}>
      <div className={styles.detailTopLine} />
      <div className={`${styles.detailIcon} ${isMobile ? styles.detailIconSm : ''}`}>{icon}</div>
      <div>
        <div className={styles.detailDayLabel}>{labelText}</div>
        <div className={`${styles.detailTemp} ${isMobile ? styles.detailTempSm : ''}`}>
          {tempMax}°
          <span className={`${styles.detailTempMin} ${isMobile ? styles.detailTempMinSm : ''}`}>
            / {tempMin}°
          </span>
        </div>
      </div>
      {desc && (
        <div
          className={styles.detailBadge}
          style={{
            background:
              cls === 'good' ? 'rgba(91,184,50,0.12)' :
              cls === 'rain' ? 'rgba(79,172,254,0.1)'  :
              'rgba(128,128,128,0.08)',
            border: `1px solid ${
              cls === 'good' ? 'rgba(91,184,50,0.25)'  :
              cls === 'rain' ? 'rgba(79,172,254,0.2)'  :
              'rgba(128,128,128,0.15)'
            }`,
            color: descColor,
          }}
        >
          {desc}
        </div>
      )}
    </div>
  );
};

const DayCard = ({ index, day, selected, hovered, onSelect, onHover, isMobile, t }) => {
  const ct       = t.calendar;
  const today    = new Date();
  const date     = new Date(today);
  date.setDate(today.getDate() + index);

  const isToday    = index === 0;
  const isTomorrow = index === 1;
  const isSelected = selected === index;
  const isHovered  = hovered === index;
  const hasData    = !!day;

  const { icon, desc, cls, tempMax, tempMin } = day || {};

  const monthsList = t.locale === 'en-US' ? MONTHS_EN : MONTHS;
  const weekday = date.toLocaleDateString(t.locale, { weekday: 'short' });
  const dateStr = date.getDate() + ' ' + monthsList[date.getMonth()].slice(0, 3);

  const descColor =
    cls === 'good' ? '#5AB832' :
    cls === 'rain' ? '#4facfe' :
    'var(--color-text-secondary)';

  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => hasData && onSelect(index)}
      className={`
        ${styles.dayCard}
        ${isSelected ? styles.dayCardSelected : ''}
        ${isToday && !isSelected ? styles.dayCardToday : ''}
        ${isHovered && !isSelected && hasData ? styles.dayCardHovered : ''}
        ${!hasData ? styles.dayCardEmpty : ''}
      `}
    >
      {(isToday || isSelected) && <div className={styles.cardTopLine} />}

      {(isToday || isTomorrow) && (
        <div className={`${styles.badge} ${isToday ? styles.badgeToday : styles.badgeTomorrow}`}>
          {isToday ? ct.today : ct.tomorrow}
        </div>
      )}

      <div className={styles.dateInfo}>
        {!isToday && !isTomorrow && (
          <span className={styles.weekdayLabel}>{weekday}</span>
        )}
        <span className={styles.dateLabel}>{dateStr}</span>
      </div>

      {hasData ? (
        <>
          <div className={`${styles.emoji} ${isHovered ? styles.emojiHovered : ''}`}>{icon}</div>
          <div>
            <div className={styles.tempMax}>{tempMax}°</div>
            <div className={styles.tempMin}>
              {ct.minTemp.replace('{t}', tempMin)}
            </div>
          </div>
          {desc && !isMobile && (
            <div className={styles.descText} style={{ color: descColor }}>{desc}</div>
          )}
          {desc && isMobile && (
            <div
              className={styles.dotIndicator}
              style={{
                background:
                  cls === 'good' ? '#5AB832' :
                  cls === 'rain' ? '#4facfe' :
                  'var(--color-text-faint)',
              }}
            />
          )}
        </>
      ) : (
        <div className={styles.emptyPlaceholder}>—</div>
      )}
    </div>
  );
};

const CalendarView = ({ data, t, unit }) => {
  const ct       = t.calendar;
  const today    = new Date();
  const isMobile = useIsMobile();
  const [hovered,  setHovered]  = useState(null);
  const [selected, setSelected] = useState(0);

  const daily = data?.daily;
  const days  = daily ? daily.time.length : 0;

  const getDayData = (i) => {
    if (!daily || i >= days) return null;
    const info = getWeatherInfo(daily.weather_code[i], t.weather);
    return {
      ...info,
      // конвертуємо одразу при побудові даних
      tempMax: toDisplay(daily.temperature_2m_max[i], unit),
      tempMin: toDisplay(daily.temperature_2m_min[i], unit),
    };
  };

  const monthsList = t.locale === 'en-US' ? MONTHS_EN : MONTHS;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <p className={styles.overline}>{ct.overline}</p>
          <h2 className={styles.title}>{ct.title}</h2>
          <p className={styles.subtitle}>{ct.subtitle.replace('{days}', days)}</p>
        </div>
        <div className={styles.dateBadge}>
          <span>📅</span>
          <span>{today.getDate()} {monthsList[today.getMonth()]}</span>
        </div>
      </div>

      <DayDetail dayIndex={selected} day={getDayData(selected)} isMobile={isMobile} t={t} />

      <div className={styles.grid}>
        {Array.from({ length: TOTAL_CARDS }, (_, i) => (
          <DayCard
            key={i}
            index={i}
            day={getDayData(i)}
            selected={selected}
            hovered={hovered}
            onSelect={setSelected}
            onHover={setHovered}
            isMobile={isMobile}
            t={t}
          />
        ))}
      </div>

      {isMobile && (
        <div className={styles.mobileLegend}>
          {[
            ['#5AB832', t.calendar.good],
            ['#4facfe', t.calendar.rain],
            ['var(--color-text-secondary)', t.calendar.cloudy],
          ].map(([color, label]) => (
            <div key={label} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: color }} />
              <span className={styles.legendLabel}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarView;