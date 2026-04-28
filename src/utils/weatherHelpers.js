/**
 * Maps an Open-Meteo weather_code to display metadata.
 * @param {number} code
 * @param {object} weatherT - translations.weather object
 */
export const getWeatherStyle = (code, weatherT) => {
  const t = weatherT || {
    clear: 'Ясно', partlyCloudy: 'Хмарно', rain: 'Дощ', cloudy: 'Хмарно',
  };

  if (code === 0)
    return { label: t.clear,        emoji: '☀️',  img: 'https://cdn-icons-png.flaticon.com/512/869/869869.png' };
  if (code >= 1 && code <= 3)
    return { label: t.partlyCloudy, emoji: '⛅',  img: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' };
  if ([61, 63, 65, 80, 81, 82].includes(code))
    return { label: t.rain,         emoji: '🌧️', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' };
  return   { label: t.cloudy,       emoji: '⛅',  img: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' };
};

/**
 * Maps an Open-Meteo weather_code to calendar display info.
 * @param {number} code
 * @param {object} weatherT - translations.weather object
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