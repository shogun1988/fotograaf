const express = require('express');
const { sqlite } = require('../db/db');
const router = express.Router();

const emptyToNull = v => (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();

function getLocatieById(id) {
  return sqlite.prepare(`
    SELECT l.locatieid, l.naam, l.type, l.adres_id,
           a.addressid, a.straat, a.huisnummer, a.busnummer, a.postcode, a.stad, a.land
    FROM locatie l LEFT JOIN address a ON a.addressid = l.adres_id
    WHERE l.locatieid=?`).get(id);
}

router.get('/', (req, res, next) => {
  try {
    const locaties = sqlite.prepare(`
      SELECT l.locatieid, l.naam, l.type, a.straat, a.huisnummer, a.busnummer, a.postcode, a.stad, a.land
      FROM locatie l LEFT JOIN address a ON a.addressid = l.adres_id
      ORDER BY l.naam`).all();
    res.render('locaties/index', { title:'Locaties', pageTitle:'Locaties',
      pageSubtitle:'Alle shootlocaties met type en adres in één overzicht.', locaties });
  } catch(e) { next(e); }
});

router.get('/new', (req, res) => {
  res.render('locaties/new', { title:'Nieuwe locatie', pageTitle:'Nieuwe locatie',
    pageSubtitle:'Voeg een nieuwe shootlocatie toe aan je lijst.',
    locatie:{ naam:'', type:'studio', straat:'', huisnummer:'', busnummer:'', postcode:'', stad:'', land:'Belgie' } });
});

router.post('/', (req, res, next) => {
  try {
    const id = sqlite.transaction(() => {
      const adr = sqlite.prepare(`INSERT INTO address (straat,huisnummer,busnummer,postcode,stad,land) VALUES (?,?,?,?,?,?)`).run(
        req.body.straat.trim(), req.body.huisnummer.trim(), emptyToNull(req.body.busnummer),
        req.body.postcode.trim(), req.body.stad.trim(), emptyToNull(req.body.land)||'Belgie');
      const loc = sqlite.prepare(`INSERT INTO locatie (naam,adres_id,type) VALUES (?,?,?)`).run(
        req.body.naam.trim(), adr.lastInsertRowid, emptyToNull(req.body.type));
      return loc.lastInsertRowid;
    })();
    res.redirect('/locaties/'+id+'?success=Locatie succesvol aangemaakt.');
  } catch(e) { next(e); }
});

router.get('/:id', (req, res, next) => {
  try {
    const locatie = getLocatieById(req.params.id);
    if (!locatie) { const e = new Error('Locatie niet gevonden.'); e.status=404; throw e; }
    const shoots = sqlite.prepare(`
      SELECT f.fotoshootid, f.datum, f.status, k.voornaam || ' ' || k.achternaam AS klant_naam,
             p.naam AS pakket_naam
      FROM fotoshoot f
      LEFT JOIN klant k ON k.klantid = f.klant_id
      LEFT JOIN pakket p ON p.pakketid = f.pakket_id
      WHERE f.locatie_id=? ORDER BY f.datum DESC`).all(req.params.id);
    res.render('locaties/show', { title: locatie.naam, pageTitle: locatie.naam,
      pageSubtitle:'Locatiedetails en alle fotoshoots op deze locatie.', locatie, shoots });
  } catch(e) { next(e); }
});

router.get('/:id/edit', (req, res, next) => {
  try {
    const locatie = getLocatieById(req.params.id);
    if (!locatie) { const e = new Error('Locatie niet gevonden.'); e.status=404; throw e; }
    res.render('locaties/edit', { title:'Locatie bewerken', pageTitle:'Locatie bewerken',
      pageSubtitle:'Pas de naam, het type of het adres van deze locatie aan.', locatie });
  } catch(e) { next(e); }
});

router.put('/:id', (req, res, next) => {
  try {
    const existing = getLocatieById(req.params.id);
    if (!existing) { const e = new Error('Locatie niet gevonden.'); e.status=404; throw e; }
    sqlite.transaction(() => {
      if (existing.adres_id) {
        sqlite.prepare(`UPDATE address SET straat=?,huisnummer=?,busnummer=?,postcode=?,stad=?,land=? WHERE addressid=?`).run(
          req.body.straat.trim(), req.body.huisnummer.trim(), emptyToNull(req.body.busnummer),
          req.body.postcode.trim(), req.body.stad.trim(), emptyToNull(req.body.land)||'Belgie', existing.adres_id);
      } else {
        const adr = sqlite.prepare(`INSERT INTO address (straat,huisnummer,busnummer,postcode,stad,land) VALUES (?,?,?,?,?,?)`).run(
          req.body.straat.trim(), req.body.huisnummer.trim(), emptyToNull(req.body.busnummer),
          req.body.postcode.trim(), req.body.stad.trim(), emptyToNull(req.body.land)||'Belgie');
        sqlite.prepare(`UPDATE locatie SET adres_id=? WHERE locatieid=?`).run(adr.lastInsertRowid, req.params.id);
      }
      sqlite.prepare(`UPDATE locatie SET naam=?,type=? WHERE locatieid=?`).run(
        req.body.naam.trim(), emptyToNull(req.body.type), req.params.id);
    })();
    res.redirect('/locaties/'+req.params.id+'?success=Locatie succesvol bijgewerkt.');
  } catch(e) { next(e); }
});

router.delete('/:id', (req, res, next) => {
  try {
    const shoots = sqlite.prepare(`SELECT COUNT(*) AS n FROM fotoshoot WHERE locatie_id=?`).get(req.params.id).n;
    if (shoots > 0) {
      return res.redirect(`/locaties/${req.params.id}?error=Kan niet verwijderen: deze locatie is nog gekoppeld aan ${shoots} fotoshoot(s). Wijzig of verwijder die shoots eerst.`);
    }
    sqlite.prepare(`DELETE FROM locatie WHERE locatieid=?`).run(req.params.id);
    res.redirect('/locaties?success=Locatie verwijderd.');
  } catch(e) { next(e); }
});

module.exports = router;
