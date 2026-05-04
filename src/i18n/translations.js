export const translations = {
  uk: {
    nav: {
      dashboard: 'Дашборд',
      map:       'Карта',
      calendar:  'Календар',
      settings:  'Налаштування',
      help:      'Довідка',
    },

    pageTitles: {
      dashboard: 'Добрий день',
      map:       'Метеокарта',
      calendar:  'Планувальник',
      settings:  'Налаштування',
      help:      'Довідка',
    },

    dashboard: {
      popularCities:  'Популярні міста',
      todayMetrics:   'Показники сьогодні',
      weekForecast:   'Прогноз на тиждень',
      today:          'Сьогодні',
      feelsLike:      'Відчувається як',
      wind:           'Вітер',
      humidity:       'Вологість',
      uvIndex:        'УФ Індекс',
      visibility:     'Видимість',
      visibilityVal:  '10 км',
      windUnit:       'км/год',
    },

    map: {
      realData:    'Реальні дані',
      title:       'Метеорологічна мапа',
      subtitle:    'Погодні шари в реальному часі',
      live:        'LIVE',
      temperature: 'Температура',
      precipitation:'Опади',
      wind:        'Вітер',
      tempDesc:    'Розподіл температур',
      precipDesc:  'Кількість опадів',
      windDesc:    'Швидкість вітру',
      min:         'Мін',
      max:         'Макс',
      yourLocation:'Ваша локація',
    },

    calendar: {
      overline:  'Прогноз погоди',
      title:     'Планувальник',
      subtitle:  'Прогноз на {days} днів вперед',
      today:     'Сьогодні',
      tomorrow:  'Завтра',
      minTemp:   '{t}° мін',
      good:      'Гарна погода',
      rain:      'Дощ',
      cloudy:    'Хмарно',
    },

    settings: {
      overline:        'Конфігурація',
      title:           'Налаштування',
      subtitle:        'Персоналізуйте свій досвід',
      theme:           'Тема',
      dark:            'Темна',
      light:           'Світла',
      units:           'Одиниці',
      language:        'Мова',
      appearance:      'Зовнішній вигляд',
      darkTheme:       'Темна тема',
      darkThemeSub:    'Темні кольори для інтерфейсу',
      unitLabel:       'Одиниці вимірювання',
      unitSub:         'Шкала температури',
      celsius:         'Цельсій °C',
      fahrenheit:      'Фаренгейт °F',
      langLabel:       'Мова системи',
      langSub:         'Мова інтерфейсу та прогнозів',
      langUk:          '🇺🇦 Українська',
      langEn:          '🇬🇧 English',
      notifications:   'Сповіщення',
      rainAlert:       'Сповіщення про дощ',
      rainAlertSub:    'Нагадування за 1 год до опадів',
      extremeAlert:    'Екстремальна погода',
      extremeAlertSub: 'Попередження про шторм, сильний мороз',
      about:           'Про застосунок',
      version:         'Версія застосунку',
      versionSub:      'Остання доступна версія',
      license:         'Ліцензія та дані',
      licenseSub:      'Open-Meteo API • OSM',
      details:         'Детальніше →',
      reset:           'Скинути всі налаштування до заводських',
      footer:          'Погода · v2.1.0 · Дані: open-meteo.com',
    },

    help: {
      overline: 'Підтримка',
      title:    'Центр допомоги',
      items: [
        {
          icon:  '🌍',
          title: 'Джерело даних',
          desc:  'Погодні дані надає Open-Meteo API — безкоштовний відкритий сервіс прогнозів.',
        },
        {
          icon:  '📍',
          title: 'Геолокація',
          desc:  'Ваше місцезнаходження визначається автоматично за IP-адресою через GeoJS.',
        },
        {
          icon:  '💬',
          title: "Зворотний зв'язок",
          desc:  "Для питань та пропозицій звертайтесь до розробника через форму зворотного зв'язку.",
        },
      ],
    },

    weather: {
      clear:          'Ясно',
      partlyCloudy:   'Хмарно',
      cloudy:         'Хмарно',
      rain:           'Дощ',
      clearSunny:     'Ясно та сонячно',
      mostlySunny:    'Переважно сонячно',
      fog:            'Туман',
      drizzle:        'Мряка',
      rainyDay:       'Дощовий день',
      snow:           'Сніг',
      lightRain:      'Можливий легкий дощ',
      thunderstorm:   'Гроза',
      variableClouds: 'Мінлива хмарність',
    },

    header: {
      searchPlaceholder: 'Пошук локації…',
    },

    cities: {
      'Cherkasy':      'Черкаси',
      'Kyiv':          'Київ',
      'Kharkiv':       'Харків',
      'Odessa':        'Одеса',
      'Dnipro':        'Дніпро',
      'Lviv':          'Львів',
      'Zaporizhzhia':  'Запоріжжя',
      'Mykolaiv':      'Миколаїв',
      'Vinnytsia':     'Вінниця',
      'Poltava':       'Полтава',
      'London':        'Лондон',
      'New York':      'Нью-Йорк',
      'Tokyo':         'Токіо',
      'Paris':         'Париж',
      'Berlin':        'Берлін',
    },

    locale: 'uk-UA',
  },

  en: {
    nav: {
      dashboard: 'Dashboard',
      map:       'Map',
      calendar:  'Calendar',
      settings:  'Settings',
      help:      'Help',
    },

    pageTitles: {
      dashboard: 'Good day',
      map:       'Weather Map',
      calendar:  'Planner',
      settings:  'Settings',
      help:      'Help',
    },

    dashboard: {
      popularCities: 'Popular cities',
      todayMetrics:  'Today\'s metrics',
      weekForecast:  'Week forecast',
      today:         'Today',
      feelsLike:     'Feels like',
      wind:          'Wind',
      humidity:      'Humidity',
      uvIndex:       'UV Index',
      visibility:    'Visibility',
      visibilityVal: '10 km',
      windUnit:      'km/h',
    },

    map: {
      realData:    'Live data',
      title:       'Weather Map',
      subtitle:    'Real-time weather layers',
      live:        'LIVE',
      temperature: 'Temperature',
      precipitation:'Precipitation',
      wind:        'Wind',
      tempDesc:    'Temperature distribution',
      precipDesc:  'Precipitation amount',
      windDesc:    'Wind speed',
      min:         'Min',
      max:         'Max',
      yourLocation:'Your location',
    },

    calendar: {
      overline:  'Weather forecast',
      title:     'Planner',
      subtitle:  '{days}-day forecast',
      today:     'Today',
      tomorrow:  'Tomorrow',
      minTemp:   '{t}° min',
      good:      'Nice weather',
      rain:      'Rain',
      cloudy:    'Cloudy',
    },

    settings: {
      overline:        'Configuration',
      title:           'Settings',
      subtitle:        'Personalise your experience',
      theme:           'Theme',
      dark:            'Dark',
      light:           'Light',
      units:           'Units',
      language:        'Language',
      appearance:      'Appearance',
      darkTheme:       'Dark theme',
      darkThemeSub:    'Dark colours for the interface',
      unitLabel:       'Units of measurement',
      unitSub:         'Temperature scale',
      celsius:         'Celsius °C',
      fahrenheit:      'Fahrenheit °F',
      langLabel:       'System language',
      langSub:         'Interface and forecast language',
      langUk:          '🇺🇦 Ukrainian',
      langEn:          '🇬🇧 English',
      notifications:   'Notifications',
      rainAlert:       'Rain alerts',
      rainAlertSub:    'Reminder 1 hour before precipitation',
      extremeAlert:    'Extreme weather',
      extremeAlertSub: 'Storm and severe frost warnings',
      about:           'About',
      version:         'App version',
      versionSub:      'Latest available version',
      license:         'License & data',
      licenseSub:      'Open-Meteo API • OSM',
      details:         'Learn more →',
      reset:           'Reset all settings to factory defaults',
      footer:          'Weather · v2.1.0 · Data: open-meteo.com',
    },

    help: {
      overline: 'Support',
      title:    'Help Centre',
      items: [
        {
          icon:  '🌍',
          title: 'Data source',
          desc:  'Weather data is provided by Open-Meteo API — a free and open forecast service.',
        },
        {
          icon:  '📍',
          title: 'Geolocation',
          desc:  'Your location is detected automatically from your IP address via GeoJS.',
        },
        {
          icon:  '💬',
          title: 'Feedback',
          desc:  'For questions and suggestions, contact the developer through the feedback form.',
        },
      ],
    },

    weather: {
      clear:          'Clear',
      partlyCloudy:   'Partly cloudy',
      cloudy:         'Cloudy',
      rain:           'Rain',
      clearSunny:     'Clear and sunny',
      mostlySunny:    'Mostly sunny',
      fog:            'Fog',
      drizzle:        'Drizzle',
      rainyDay:       'Rainy day',
      snow:           'Snow',
      lightRain:      'Possible light rain',
      thunderstorm:   'Thunderstorm',
      variableClouds: 'Variable clouds',
    },

    header: {
      searchPlaceholder: 'Search location…',
    },

    cities: {},

    locale: 'en-US',
  },
};

/**
 * Returns the translation object for the given language.
 * Falls back to Ukrainian if lang is not found.
 * @param {'uk'|'en'} lang
 * @returns {typeof translations.uk}
 */
export const getT = (lang) => translations[lang] ?? translations.uk;

/**
 * Translates a city name using the current language's cities map.
 * Falls back to the original name if no translation found.
 * @param {string} cityName
 * @param {typeof translations.uk} t
 * @returns {string}
 */
export const translateCity = (cityName, t) =>
  (t.cities && t.cities[cityName]) || cityName;