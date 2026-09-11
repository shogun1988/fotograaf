const express = require('express');
const { sqlite, likePattern } = require('../db/db');
const router = express.Router();

const emptyToNull = v => (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();

function getFactuurById(id) {
  return sqlite.prepare(`
    SELECT fa.factuurid, fa.datum, fa.totaalbedrag, fa.status, fa.klant_id, fa.fotoshoot_id,
           k.voornaam || ' ' || k.achternaam AS klant_naam,
           f.datum AS shoot_datum
    FROM factuur fa
    LEFT JOIN klant k ON k.klantid = fa.klant_id
    LEFT JOIN fotoshoot f ON f.fotoshootid = fa.fotoshoot_id
    WHERE fa.factuurid = ?`).get(id);
}

function loadFormData() {
  return {
    klanten:    sqlite.prepare(`SELECT klantid, voornaam, achternaam FROM klant ORDER BY voornaam, achternaam`).all(),
    fotoshoots: sqlite.prepare(`
      SELECT f.fotoshootid, f.datum, k.voornaam || ' ' || k.achternaam AS klant_naam
      FROM fotoshoot f LEFT JOIN klant k ON k.klantid = f.klant_id
      ORDER BY f.datum DESC`).all()
  };
}

router.get('/', (req, res, next) => {
  try {
    const search = String(req.query.q || '').trim();
    const searchClause = search ? `
      WHERE (
        CAST(fa.factuurid AS TEXT) || ' ' || COALESCE(fa.datum, '') || ' ' ||
        COALESCE(fa.status, '') || ' ' || CAST(COALESCE(fa.totaalbedrag, 0) AS TEXT) || ' ' ||
        COALESCE(k.voornaam || ' ' || k.achternaam, '') || ' ' ||
        CAST(COALESCE(fa.fotoshoot_id, '') AS TEXT)
      ) LIKE ? COLLATE NOCASE ESCAPE '\\'` : '';
    const facturen = sqlite.prepare(`
      SELECT fa.factuurid, fa.datum, fa.totaalbedrag, fa.status, fa.fotoshoot_id,
             k.voornaam || ' ' || k.achternaam AS klant_naam
      FROM factuur fa LEFT JOIN klant k ON k.klantid = fa.klant_id
      ${searchClause}
      ORDER BY fa.datum DESC, fa.factuurid DESC`).all(...(search ? [likePattern(search)] : []));
    const totalen = sqlite.prepare(`
      SELECT COUNT(*) AS totaal_aantal,
             SUM(CASE WHEN status='open'    THEN 1 ELSE 0 END) AS open_aantal,
             SUM(CASE WHEN status='betaald' THEN 1 ELSE 0 END) AS betaald_aantal,
             COALESCE(SUM(CASE WHEN status='open'    THEN totaalbedrag END),0) AS open_bedrag,
             COALESCE(SUM(CASE WHEN status='betaald' THEN totaalbedrag END),0) AS betaald_bedrag
      FROM factuur`).get();
    res.render('facturen/index', { title:'Facturen', pageTitle:'Facturen',
      pageSubtitle:'Hou openstaande en betaalde facturen nauwkeurig bij.', facturen, totalen, search });
  } catch(e) { next(e); }
});

router.get('/new', (req, res, next) => {
  try {
    res.render('facturen/new', { title:'Nieuwe factuur', pageTitle:'Nieuwe factuur',
      pageSubtitle:'Maak een nieuwe factuur aan voor een klant of fotoshoot.',
      factuur:{ klant_id:'', fotoshoot_id:'', datum:'', totaalbedrag:'', status:'open' },
      ...loadFormData() });
  } catch(e) { next(e); }
});

router.post('/', (req, res, next) => {
  try {
    const info = sqlite.prepare(`
      INSERT INTO factuur (klant_id, fotoshoot_id, datum, totaalbedrag, status)
      VALUES (?,?,?,?,?)`).run(
      Number(req.body.klant_id) || null,
      emptyToNull(req.body.fotoshoot_id) ? Number(req.body.fotoshoot_id) : null,
      emptyToNull(req.body.datum),
      parseFloat(req.body.totaalbedrag) || 0,
      req.body.status || 'open');
    res.redirect('/facturen/' + info.lastInsertRowid + '?success=Factuur succesvol aangemaakt.');
  } catch(e) { next(e); }
});

router.get('/:id', (req, res, next) => {
  try {
    const factuur = getFactuurById(req.params.id);
    if (!factuur) { const e = new Error('Factuur niet gevonden.'); e.status=404; throw e; }
    const betalingen = sqlite.prepare(`SELECT * FROM betaling WHERE factuur_id=? ORDER BY datum DESC`).all(req.params.id);
    res.render('facturen/show', { title:'Factuur #'+factuur.factuurid, pageTitle:'Factuur #'+factuur.factuurid,
      pageSubtitle:'Volledige factuurdetails inclusief betalingshistoriek.', factuur, betalingen });
  } catch(e) { next(e); }
});

router.get('/:id/edit', (req, res, next) => {
  try {
    const factuur = getFactuurById(req.params.id);
    if (!factuur) { const e = new Error('Factuur niet gevonden.'); e.status=404; throw e; }
    res.render('facturen/edit', { title:'Factuur bewerken', pageTitle:'Factuur bewerken',
      pageSubtitle:'Pas het bedrag, de status of de gekoppelde shoot aan.', factuur, ...loadFormData() });
  } catch(e) { next(e); }
});

router.put('/:id', (req, res, next) => {
  try {
    sqlite.prepare(`
      UPDATE factuur SET klant_id=?, fotoshoot_id=?, datum=?, totaalbedrag=?, status=?
      WHERE factuurid=?`).run(
      Number(req.body.klant_id) || null,
      emptyToNull(req.body.fotoshoot_id) ? Number(req.body.fotoshoot_id) : null,
      emptyToNull(req.body.datum),
      parseFloat(req.body.totaalbedrag) || 0,
      req.body.status || 'open',
      req.params.id);
    res.redirect('/facturen/'+req.params.id+'?success=Factuur succesvol bijgewerkt.');
  } catch(e) { next(e); }
});

router.delete('/:id', (req, res, next) => {
  try {
    const betalingen = sqlite.prepare(`SELECT COUNT(*) AS n FROM betaling WHERE factuur_id=?`).get(req.params.id).n;
    if (betalingen > 0) {
      return res.redirect(`/facturen/${req.params.id}?error=Kan niet verwijderen: er zijn nog ${betalingen} betaling(en) gekoppeld aan deze factuur.`);
    }
    sqlite.prepare(`DELETE FROM factuur WHERE factuurid=?`).run(req.params.id);
    res.redirect('/facturen?success=Factuur verwijderd.');
  } catch(e) { next(e); }
});

module.exports = router;
