const express = require('express');
const { sqlite } = require('../db/db');
const router = express.Router();

const emptyToNull = v => (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();

router.get('/', (req, res, next) => {
  try {
    const pakketten = sqlite.prepare(`SELECT * FROM pakket ORDER BY prijs ASC, naam ASC`).all();
    res.render('pakketten/index', { title:'Pakketten', pageTitle:'Pakketten',
      pageSubtitle:'Een helder overzicht van alle aangeboden fotografiepakketten.', pakketten });
  } catch(e) { next(e); }
});

router.get('/new', (req, res) => {
  res.render('pakketten/new', { title:'Nieuw pakket', pageTitle:'Nieuw pakket',
    pageSubtitle:'Voeg een nieuw fotografiepakket toe aan je aanbod.',
    pakket:{ naam:'', beschrijving:'', prijs:'', aantal_fotos_inbegrepen:'', levertijd_dagen:'' } });
});

router.post('/', (req, res, next) => {
  try {
    const info = sqlite.prepare(`
      INSERT INTO pakket (naam, beschrijving, prijs, aantal_fotos_inbegrepen, levertijd_dagen)
      VALUES (?,?,?,?,?)`).run(
      req.body.naam.trim(),
      emptyToNull(req.body.beschrijving),
      parseFloat(req.body.prijs) || 0,
      parseInt(req.body.aantal_fotos_inbegrepen) || null,
      parseInt(req.body.levertijd_dagen) || null);
    res.redirect('/pakketten/' + info.lastInsertRowid + '?success=Pakket succesvol aangemaakt.');
  } catch(e) { next(e); }
});

router.get('/:id', (req, res, next) => {
  try {
    const pakket = sqlite.prepare(`SELECT * FROM pakket WHERE pakketid=?`).get(req.params.id);
    if (!pakket) { const e = new Error('Pakket niet gevonden.'); e.status=404; throw e; }
    const shoots = sqlite.prepare(`
      SELECT f.fotoshootid, f.datum, f.status, k.voornaam || ' ' || k.achternaam AS klant_naam
      FROM fotoshoot f LEFT JOIN klant k ON k.klantid = f.klant_id
      WHERE f.pakket_id=? ORDER BY f.datum DESC`).all(req.params.id);
    res.render('pakketten/show', { title: pakket.naam, pageTitle: pakket.naam,
      pageSubtitle:'Pakketdetails en gekoppelde fotoshoots.', pakket, shoots });
  } catch(e) { next(e); }
});

router.get('/:id/edit', (req, res, next) => {
  try {
    const pakket = sqlite.prepare(`SELECT * FROM pakket WHERE pakketid=?`).get(req.params.id);
    if (!pakket) { const e = new Error('Pakket niet gevonden.'); e.status=404; throw e; }
    res.render('pakketten/edit', { title:'Pakket bewerken', pageTitle:'Pakket bewerken',
      pageSubtitle:'Pas de naam, prijs of details van dit pakket aan.', pakket });
  } catch(e) { next(e); }
});

router.put('/:id', (req, res, next) => {
  try {
    sqlite.prepare(`
      UPDATE pakket SET naam=?, beschrijving=?, prijs=?, aantal_fotos_inbegrepen=?, levertijd_dagen=?
      WHERE pakketid=?`).run(
      req.body.naam.trim(),
      emptyToNull(req.body.beschrijving),
      parseFloat(req.body.prijs) || 0,
      parseInt(req.body.aantal_fotos_inbegrepen) || null,
      parseInt(req.body.levertijd_dagen) || null,
      req.params.id);
    res.redirect('/pakketten/'+req.params.id+'?success=Pakket succesvol bijgewerkt.');
  } catch(e) { next(e); }
});

router.delete('/:id', (req, res, next) => {
  try {
    const shoots = sqlite.prepare(`SELECT COUNT(*) AS n FROM fotoshoot WHERE pakket_id=?`).get(req.params.id).n;
    if (shoots > 0) {
      return res.redirect(`/pakketten/${req.params.id}?error=Kan niet verwijderen: dit pakket is nog gekoppeld aan ${shoots} fotoshoot(s). Wijzig of verwijder die shoots eerst.`);
    }
    sqlite.prepare(`DELETE FROM pakket WHERE pakketid=?`).run(req.params.id);
    res.redirect('/pakketten?success=Pakket verwijderd.');
  } catch(e) { next(e); }
});

module.exports = router;
