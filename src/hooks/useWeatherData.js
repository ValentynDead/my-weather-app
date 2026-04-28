import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { OTHER_CITIES_LIST } from '../utils/constants';

const fetchWeatherData = async () => {
  const geo = await axios.get('https://get.geojs.io/v1/ip/geo.json');
  const { latitude: lat, longitude: lon } = geo.data;

  const geoName = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=uk`
  );
  const city =
    geoName.data.address.city    ||
    geoName.data.address.town    ||
    geoName.data.address.village ||
    geoName.data.address.county  ||
    geo.data.city;

  const res = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
    `&forecast_days=7&timezone=auto`
  );

  const resCalendar = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=16&timezone=auto`
  );

  const others = await Promise.all(
    OTHER_CITIES_LIST.map(async (c) => {
      const r = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
        `&current=temperature_2m,weather_code&timezone=auto`
      );
      return {
        ...c,
        temp: Math.round(r.data.current.temperature_2m),
        code: r.data.current.weather_code,
      };
    })
  );

  return {
    city,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    current: res.data.current,
    daily: res.data.daily,
    dailyCalendar: resCalendar.data.daily,
    others,
  };
};


export const useWeatherData = () =>
  useQuery({
    queryKey: ['weatherData'],
    queryFn: fetchWeatherData,
  });