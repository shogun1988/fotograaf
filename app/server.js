const path = require('path');
const express = require('express');
const methodOverride = require('method-override');

const indexRoutes = require('./routes/index');
const klantenRoutes = require('./routes/klanten');
const fotoshootsRoutes = require('./routes/fotoshoots');
const facturenRoutes = require('./routes/facturen');
const pakkettenRoutes = require('./routes/pakketten');
const locatiesRoutes = require('./routes/locaties');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

const normalizeStatus = (value) => String(value || '').trim().toLowerCase();

app.locals.formatCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

app.locals.formatDate = (value) => {
  if (!value) {
    return '—';
  }

  if (typeof value === 'string') {
    const parts = value.split('-');

    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }

    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return String(value);
};

app.locals.formatTime = (value) => {
  if (!value) {
    return '—';
  }

  return String(value).slice(0, 5);
};

app.locals.formatAddress = (row) => {
  if (!row || !row.straat) {
    return '—';
  }

  const busnummer = row.busnummer ? ` bus ${row.busnummer}` : '';
  const land = row.land ? `, ${row.land}` : '';

  return `${row.straat} ${row.huisnummer}${busnummer}, ${row.postcode} ${row.stad}${land}`;
};

app.locals.badgeClass = (status) => {
  const normalized = normalizeStatus(status);
  const mapping = {
    gepland: 'badge status-gepland',
    afgewerkt: 'badge status-afgewerkt',
    geannuleerd: 'badge status-geannuleerd',
    open: 'badge status-open',
    betaald: 'badge status-betaald'
  };

  return mapping[normalized] || 'badge status-default';
};

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.feedback = {
    success: req.query.success || '',
    error: req.query.error || ''
  };
  next();
});

app.use('/', indexRoutes);
app.use('/klanten', klantenRoutes);
app.use('/fotoshoots', fotoshootsRoutes);
app.use('/facturen', facturenRoutes);
app.use('/pakketten', pakkettenRoutes);
app.use('/locaties', locatiesRoutes);

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="nl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pagina niet gevonden</title>
        <style>
          body { font-family: "DM Sans", Arial, sans-serif; background: #f6f5f2; color: #20201e; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .card { background: white; border: 1px solid #e8e7e3; border-radius: 1rem; box-shadow: 0 9px 24px rgba(47, 43, 38, .045); padding: 2rem; max-width: 28rem; }
          a { color: #c86745; text-decoration: none; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Pagina niet gevonden</h1>
          <p>De opgevraagde pagina bestaat niet meer of is verplaatst.</p>
          <a href="/">Terug naar dashboard</a>
        </div>
      </body>
    </html>
  `);
});

app.use((error, req, res, next) => {
  console.error(error);
  const message = error.code === '23505'
    ? 'Dit e-mailadres bestaat al in het systeem.'
    : error.message || 'Er ging iets mis.';

  res.status(error.status || 500).send(`
    <!DOCTYPE html>
    <html lang="nl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Serverfout</title>
        <style>
          body { font-family: "DM Sans", Arial, sans-serif; background: #f6f5f2; color: #20201e; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .card { background: white; border: 1px solid #e8e7e3; border-radius: 1rem; box-shadow: 0 9px 24px rgba(47, 43, 38, .045); padding: 2rem; max-width: 34rem; }
          a { color: #c86745; text-decoration: none; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Er ging iets mis</h1>
          <p>${message}</p>
          <a href="/">Terug naar dashboard</a>
        </div>
      </body>
    </html>
  `);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Fotograaf webapp draait op http://localhost:${port}`);
  });
}

module.exports = app;
