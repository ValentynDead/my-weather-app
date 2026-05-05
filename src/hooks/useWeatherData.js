import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { OTHER_CITIES_LIST } from '../utils/constants';

/**
 * Fetches current, daily, and 16-day forecast data for a specific set of coordinates.
 * Also retrieves basic weather info for other pre-configured cities.
 * * @param {string|number} lat - Latitude coordinate.
 * @param {string|number} lon - Longitude coordinate.
 * @param {string} cityName - Resolved name of the city.
 * @param {string} language - Active localization code.
 * @returns {Promise<Object>} Formatted weather data payload.
 */
const fetchWeatherForCoords = async (lat, lon, cityName, language) => {
  // Fetch detailed current and 7-day weather metrics
  const res = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max,apparent_temperature_max` +
    `&forecast_days=7&timezone=auto`
  );

  // Fetch extended 16-day forecast used for the calendar view
  const resCalendar = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=16&timezone=auto`
  );

  // Fetch basic weather conditions for the pinned popular cities list
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
    city: cityName,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    current: res.data.current,
    daily: res.data.daily,
    dailyCalendar: resCalendar.data.daily,
    others,
  };
};

/**
 * Orchestrates geolocation lookup (either via search query or IP fallback) 
 * and handles weather data fetching.
 * * @param {string} language - Target translation language.
 * @param {string|null} searchCity - Optional query to search for a specific city.
 * @returns {Promise<Object>} Complete weather data payload.
 */
const fetchWeatherData = async (language = 'uk', searchCity = null) => {
  try {
    // ── Direct City Name Search (Nominatim Geocoding) ─────────────────────────
    if (searchCity) {
      const geoSearch = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchCity)}&format=json&limit=1&accept-language=${language}`
      );
      if (!geoSearch.data.length) throw new Error('City not found');

      const { lat, lon, display_name } = geoSearch.data[0];
      const cityName = display_name.split(',')[0];
      return fetchWeatherForCoords(lat, lon, cityName, language);
    }

    // ── Automatic IP Geolocation (Default Fallback) ───────────────────────────
    const geo = await axios.get('https://get.geojs.io/v1/ip/geo.json');
    const { latitude: lat, longitude: lon } = geo.data;

    // Resolves human-readable city names from coordinates (Reverse Geocoding)
    const geoName = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${language}`
    );
    const city =
      geoName.data.address.city    ||
      geoName.data.address.town    ||
      geoName.data.address.village ||
      geoName.data.address.county  ||
      geo.data.city;

    return fetchWeatherForCoords(lat, lon, city, language);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
};

/**
 * Custom React Query hook for fetching and caching weather data.
 * * @param {string} language - Selected application language.
 * @param {string|null} searchCity - Targeted city name query.
 * @returns {UseQueryResult} Query result including data, loading, and error states.
 */
export const useWeatherData = (language, searchCity) =>
  useQuery({
    queryKey: ['weatherData', language, searchCity ?? '__ip__'],
    queryFn: () => fetchWeatherData(language, searchCity),
    staleTime: 5 * 60 * 1000, // Keeps data fresh for 5 minutes
    retry: 1,
  });