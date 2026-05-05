/**
 * Resolves the visual styles, icons, and localized labels for a given WMO weather code.
 * Used for high-level dashboard summaries and visual cards.
 * * @param {number} code - WMO weather interpretation code.
 * @param {Object} [weatherT] - Localized string translations.
 * @returns {Object} Style configurations containing labels, emojis, and remote icons.
 */
export const getWeatherStyle = (code, weatherT) => {
  const t = weatherT || {
    clear: 'Ясно', partlyCloudy: 'Мінлива хмарність', cloudy: 'Хмарно',
    rain: 'Дощ', drizzle: 'Мряка', snow: 'Сніг', fog: 'Туман',
    thunderstorm: 'Гроза', lightRain: 'Легкий дощ',
  };

  if (code === 0)
    return { label: t.clear,         emoji: '☀️',  img: 'https://cdn-icons-png.flaticon.com/512/869/869869.png' };
  if (code >= 1 && code <= 2)
    return { label: t.partlyCloudy, emoji: '🌤️', img: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' };
  if (code === 3)
    return { label: t.cloudy,        emoji: '☁️',  img: 'https://cdn-icons-png.flaticon.com/512/414/414927.png' };
  if (code >= 45 && code <= 48)
    return { label: t.fog,          emoji: '🌫️', img: 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png' };
  if (code >= 51 && code <= 55)
    return { label: t.drizzle,      emoji: '🌦️', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' };
  if (code >= 61 && code <= 65)
    return { label: t.rain,         emoji: '🌧️', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' };
  if (code >= 71 && code <= 77)
    return { label: t.snow,         emoji: '❄️',  img: 'https://cdn-icons-png.flaticon.com/512/642/642102.png' };
  if (code >= 80 && code <= 82)
    return { label: t.lightRain,    emoji: '🌦️', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' };
  if (code >= 95 && code <= 99)
    return { label: t.thunderstorm, emoji: '⛈️',  img: 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png' };
  return { label: t.partlyCloudy,   emoji: '⛅',  img: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' };
};

/**
 * Resolves detailed descriptions and structural CSS classes for a given WMO weather code.
 * Primarily used within list items and extended forecast planners (e.g., Calendar View).
 * * @param {number} code - WMO weather interpretation code.
 * @param {Object} [weatherT] - Localized string translations.
 * @returns {Object} Data payload containing icon, description, and status styling rules.
 */
export const getWeatherInfo = (code, weatherT) => {
  const t = weatherT || {
    clearSunny: 'Ясно та сонячно', mostlySunny: 'Переважно сонячно',
    cloudy: 'Хмарно', fog: 'Туман', drizzle: 'Мряка',
    rainyDay: 'Дощовий день', snow: 'Сніг', lightRain: 'Можливий легкий дощ',
    thunderstorm: 'Гроза', variableClouds: 'Мінлива хмарність',
  };

  if (code === 0)               return { icon: '☀️',  desc: t.clearSunny,     cls: 'good' };
  if (code >= 1 && code <= 2)   return { icon: '🌤️', desc: t.mostlySunny,    cls: 'good' };
  if (code === 3)                return { icon: '☁️',  desc: t.cloudy,         cls: ''     };
  if (code >= 45 && code <= 48) return { icon: '🌫️', desc: t.fog,            cls: ''     };
  if (code >= 51 && code <= 55) return { icon: '🌦️', desc: t.drizzle,        cls: 'rain' };
  if (code >= 61 && code <= 65) return { icon: '🌧️', desc: t.rainyDay,       cls: 'rain' };
  if (code >= 71 && code <= 77) return { icon: '❄️',  desc: t.snow,           cls: 'rain' };
  if (code >= 80 && code <= 82) return { icon: '🌦️', desc: t.lightRain,      cls: 'rain' };
  if (code >= 95 && code <= 99) return { icon: '⛈️',  desc: t.thunderstorm,   cls: 'rain' };
  return                               { icon: '⛅',  desc: t.variableClouds, cls: ''     };
};