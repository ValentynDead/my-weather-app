// ── Popular Cities Coordinates ────────────────────────────────────────────────
export const OTHER_CITIES_LIST = [
  { name: 'Лондон',   nameEn: 'London',   country: 'UK',    lat: 51.50, lon: -0.12  },
  { name: 'Нью-Йорк', nameEn: 'New York', country: 'USA',   lat: 40.71, lon: -74.00 },
  { name: 'Токіо',    nameEn: 'Tokyo',    country: 'Japan', lat: 35.68, lon: 139.76 },
  { name: 'Париж',    nameEn: 'Paris',    country: 'France', lat: 48.85, lon: 2.35   },
];

// ── Navigation Menu Items ─────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Дашборд'      },
  { id: 'map',       label: 'Карта'        },
  { id: 'calendar',  label: 'Календар'     },
  { id: 'settings',  label: 'Налаштування' },
  { id: 'help',      label: 'Довідка'      },
];

// ── Application Page Titles ───────────────────────────────────────────────────
export const PAGE_TITLES = {
  dashboard: 'Добрий день',
  map:       'Метеокарта',
  calendar:  'Планувальник',
  settings:  'Налаштування',
  help:      'Довідка',
};

// ── Weather Map Layer Configs ─────────────────────────────────────────────────
export const WEATHER_LAYER_LABELS = {
  temp_new:          'Температура',
  precipitation_new: 'Опади',
  wind_new:          'Вітер',
};

export const WEATHER_LAYER_GRADIENT = {
  temp_new:          'linear-gradient(to right, #4facfe, #00c6ff, #f9d423, #ff4e50)',
  precipitation_new: 'linear-gradient(to right, #e0f7fa, #4fc3f7, #0288d1, #01579b)',
  wind_new:          'linear-gradient(to right, #e8f5e9, #66bb6a, #1b5e20)',
};

export const WEATHER_LAYER_ICONS = {
  temp_new:          '🌡',
  precipitation_new: '🌧',
  wind_new:          '💨',
};

export const WEATHER_LAYER_DESCRIPTIONS = {
  temp_new:          'Розподіл температур',
  precipitation_new: 'Кількість опадів',
  wind_new:          'Швидкість вітру',
};

// ── Localization Date Helpers ─────────────────────────────────────────────────
export const MONTHS = [
  'Січня','Лютого','Березня','Квітня','Травня','Червня',
  'Липня','Серпня','Вересня','Жовтня','Листопада','Грудня',
];

export const MONTHS_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];