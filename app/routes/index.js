const express = require('express');
const https = require('https');
const { sqlite } = require('../db/db');
const router = express.Router();

// WMO weather code -> beschrijving + emoji
function weerInfo(code) {
  const map = {
    0:  { label: 'Zonnig',              emoji: '☀️',  icon: 'sun' },
    1:  { label: 'Grotendeels helder',  emoji: '🌤️', icon: 'sun' },
    2:  { label: 'Gedeeltelijk bewolkt',emoji: '⛅',  icon: 'cloud-sun' },
    3:  { label: 'Bewolkt',             emoji: '☁️',  icon: 'cloud' },
    45: { label: 'Mist',                emoji: '🌫️', icon: 'cloud' },
    48: { label: 'Rijpmist',            emoji: '🌫️', icon: 'cloud' },
    51: { label: 'Lichte motregen',     emoji: '🌦️', icon: 'cloud-drizzle' },
    53: { label: 'Motregen',            emoji: '🌦️', icon: 'cloud-drizzle' },
    55: { label: 'Dichte motregen',     emoji: '🌦️', icon: 'cloud-drizzle' },
    61: { label: 'Lichte regen',        emoji: '🌧️', icon: 'cloud-rain' },
    63: { label: 'Regen',               emoji: '🌧️', icon: 'cloud-rain' },
    65: { label: 'Zware regen',         emoji: '🌧️', icon: 'cloud-rain' },
    71: { label: 'Lichte sneeuw',       emoji: '❄️',  icon: 'cloud-snow' },
    73: { label: 'Sneeuw',              emoji: '❄️',  icon: 'cloud-snow' },
    75: { label: 'Zware sneeuw',        emoji: '❄️',  icon: 'cloud-snow' },
    77: { label: 'IJskorrels',          emoji: '❄️',  icon: 'cloud-snow' },
    80: { label: 'Lichte buien',        emoji: '🌦️', icon: 'cloud-rain' },
    81: { label: 'Buien',               emoji: '🌦️', icon: 'cloud-rain' },
    82: { label: 'Zware buien',         emoji: '⛈️',  icon: 'cloud-lightning' },
    85: { label: 'Sneeuwbuien',         emoji: '🌨️', icon: 'cloud-snow' },
    86: { label: 'Zware sneeuwbuien',   emoji: '🌨️', icon: 'cloud-snow' },
    95: { label: 'Onweer',              emoji: '⛈️',  icon: 'cloud-lightning' },
    96: { label: 'Onweer met hagel',    emoji: '⛈️',  icon: 'cloud-lightning' },
    99: { label: 'Zwaar onweer',        emoji: '⛈️',  icon: 'cloud-lightning' },
  };
  return map[code] || { label: 'Onbekend', emoji: '🌡️', icon: 'thermometer' };
}

const DAGEN_NL = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const MAANDEN_NL = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

function fetchWeer() {
  return new Promise((resolve) => {
    // Open-Meteo — Gent, Belgie (lat 51.05, lon 3.72)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=51.05&longitude=3.72' +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max' +
      '&timezone=Europe%2FBrussels&forecast_days=7';

    https.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const daily = json.daily;
          const dagen = daily.time.map((datum, i) => {
            const d = new Date(datum);
            const dagNaam = DAGEN_NL[d.getDay()];
            const isVandaag = i === 0;
            return {
              datum,
              dagLabel:   isVandaag ? 'Vandaag' : dagNaam.charAt(0).toUpperCase() + dagNaam.slice(1),
              datumLabel: `${d.getDate()} ${MAANDEN_NL[d.getMonth()]}`,
              ...weerInfo(daily.weathercode[i]),
              maxTemp:    Math.round(daily.temperature_2m_max[i]),
              minTemp:    Math.round(daily.temperature_2m_min[i]),
              neerslag:   daily.precipitation_probability_max[i] ?? 0,
              windsnelheid: Math.round(daily.windspeed_10m_max[i]),
            };
          });
          resolve({ dagen, stad: 'Gent', fout: null });
        } catch (e) {
          resolve({ dagen: [], stad: 'Gent', fout: 'Weerdata kon niet worden verwerkt.' });
        }
      });
    }).on('error', () => {
      resolve({ dagen: [], stad: 'Gent', fout: 'Weerdienst niet bereikbaar.' });
    }).on('timeout', function() {
      this.destroy();
      resolve({ dagen: [], stad: 'Gent', fout: 'Weerdienst time-out.' });
    });
  });
}

router.get('/', async (req, res, next) => {
  try {
    const metrics = {
      totaalKlanten:      sqlite.prepare(`SELECT COUNT(*) AS total FROM klant`).get().total,
      geplandeShoots:     sqlite.prepare(`SELECT COUNT(*) AS total FROM fotoshoot WHERE status='gepland'`).get().total,
      afgewerkteShoots:   sqlite.prepare(`SELECT COUNT(*) AS total FROM fotoshoot WHERE status='afgewerkt'`).get().total,
      openFacturenAantal: sqlite.prepare(`SELECT COUNT(*) AS total FROM factuur WHERE status='open'`).get().total,
      openFacturenBedrag: sqlite.prepare(`SELECT COALESCE(SUM(totaalbedrag),0) AS bedrag FROM factuur WHERE status='open'`).get().bedrag,
    };

    const recenteShoots = sqlite.prepare(`
      SELECT f.fotoshootid, f.datum, f.starttijd, f.eindtijd, f.status,
             k.voornaam || ' ' || k.achternaam AS klant_naam,
             p.naam AS pakket_naam, l.naam AS locatie_naam
      FROM fotoshoot f
      LEFT JOIN klant k ON k.klantid = f.klant_id
      LEFT JOIN pakket p ON p.pakketid = f.pakket_id
      LEFT JOIN locatie l ON l.locatieid = f.locatie_id
      ORDER BY f.datum DESC, f.starttijd DESC, f.fotoshootid DESC
      LIMIT 5`).all();

    const recenteFacturen = sqlite.prepare(`
      SELECT fa.factuurid, fa.datum, fa.totaalbedrag, fa.status,
             k.voornaam || ' ' || k.achternaam AS klant_naam
      FROM factuur fa
      LEFT JOIN klant k ON k.klantid = fa.klant_id
      ORDER BY fa.datum DESC, fa.factuurid DESC
      LIMIT 5`).all();

    const weer = await fetchWeer();

    res.render('dashboard', {
      title: 'Dashboard',
      pageTitle: 'Dashboard',
      pageSubtitle: 'Je dagelijkse overzicht van klanten, geplande shoots en facturen.',
      metrics,
      recenteShoots,
      recenteFacturen,
      weer,
    });
  } catch(e) { next(e); }
});

module.exports = router;
