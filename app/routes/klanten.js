const express = require('express');
const { sqlite, likePattern } = require('../db/db');
const router = express.Router();

const emptyToNull = v => (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();

function getKlantById(id) {
  return sqlite.prepare(`
    SELECT k.klantid, k.voornaam, k.achternaam, k.email, k.telefoon, k.type_klant, k.adres_id,
           a.addressid, a.straat, a.huisnummer, a.busnummer, a.postcode, a.stad, a.land
    FROM klant k LEFT JOIN address a ON a.addressid = k.adres_id
    WHERE k.klantid = ?`).get(id);
}

router.get('/', (req, res, next) => {
  try {
    const search = String(req.query.q || '').trim();
    const searchClause = search ? `
      WHERE (
        k.voornaam || ' ' || k.achternaam || ' ' || COALESCE(k.email, '') || ' ' ||
        COALESCE(k.telefoon, '') || ' ' || COALESCE(k.type_klant, '') || ' ' ||
        COALESCE(a.straat, '') || ' ' || COALESCE(a.postcode, '') || ' ' ||
        COALESCE(a.stad, '')
      ) LIKE ? COLLATE NOCASE ESCAPE '\\'` : '';
    const klanten = sqlite.prepare(`
      SELECT k.klantid, k.voornaam, k.achternaam, k.email, k.telefoon, k.type_klant,
             a.straat, a.huisnummer, a.busnummer, a.postcode, a.stad, a.land
      FROM klant k LEFT JOIN address a ON a.addressid = k.adres_id
      ${searchClause}
      ORDER BY k.voornaam, k.achternaam`).all(...(search ? [likePattern(search)] : []));
    res.render('klanten/index', { title:'Klanten', pageTitle:'Klanten',
      pageSubtitle:'Beheer je klantenbestand en hun contactgegevens.', klanten, search });
  } catch(e) { next(e); }
});

router.get('/new', (req, res) => {
  res.render('klanten/new', { title:'Nieuwe klant', pageTitle:'Nieuwe klant',
    pageSubtitle:'Voeg een nieuwe klant toe met volledige adresgegevens.',
    klant:{ voornaam:'',achternaam:'',email:'',telefoon:'',type_klant:'particulier',
            straat:'',huisnummer:'',busnummer:'',postcode:'',stad:'',land:'Belgie' } });
});

router.post('/', (req, res, next) => {
  try {
    const run = sqlite.transaction(() => {
      const adr = sqlite.prepare(`INSERT INTO address (straat,huisnummer,busnummer,postcode,stad,land) VALUES (?,?,?,?,?,?)`).run(
        req.body.straat.trim(), req.body.huisnummer.trim(), emptyToNull(req.body.busnummer),
        req.body.postcode.trim(), req.body.stad.trim(), emptyToNull(req.body.land)||'Belgie');
      const kl = sqlite.prepare(`INSERT INTO klant (voornaam,achternaam,email,telefoon,adres_id,type_klant) VALUES (?,?,?,?,?,?)`).run(
        req.body.voornaam.trim(), req.body.achternaam.trim(), req.body.email.trim(),
        emptyToNull(req.body.telefoon), adr.lastInsertRowid, emptyToNull(req.body.type_klant));
      return kl.lastInsertRowid;
    });
    const id = run();
    res.redirect('/klanten/' + id + '?success=Klant succesvol toegevoegd.');
  } catch(e) { next(e); }
});

router.get('/:id', (req, res, next) => {
  try {
    const klant = getKlantById(req.params.id);
    if (!klant) { const e = new Error('Klant niet gevonden.'); e.status=404; throw e; }
    const fotoshoots = sqlite.prepare(`
      SELECT f.fotoshootid, f.datum, f.starttijd, f.eindtijd, f.status,
             p.naam AS pakket_naam, l.naam AS locatie_naam
      FROM fotoshoot f
      LEFT JOIN pakket p ON p.pakketid = f.pakket_id
      LEFT JOIN locatie l ON l.locatieid = f.locatie_id
      WHERE f.klant_id = ? ORDER BY f.datum DESC, f.starttijd DESC`).all(req.params.id);
    res.render('klanten/show', { title: klant.voornaam+' '+klant.achternaam,
      pageTitle: klant.voornaam+' '+klant.achternaam,
      pageSubtitle:'Klantfiche met contactinformatie en gekoppelde fotoshoots.',
      klant, fotoshoots });
  } catch(e) { next(e); }
});

router.get('/:id/edit', (req, res, next) => {
  try {
    const klant = getKlantById(req.params.id);
    if (!klant) { const e = new Error('Klant niet gevonden.'); e.status=404; throw e; }
    res.render('klanten/edit', { title:'Klant bewerken', pageTitle:'Klant bewerken',
      pageSubtitle:'Werk contactgegevens en adresgegevens van deze klant bij.', klant });
  } catch(e) { next(e); }
});

router.put('/:id', (req, res, next) => {
  try {
    const existing = getKlantById(req.params.id);
    if (!existing) { const e = new Error('Klant niet gevonden.'); e.status=404; throw e; }
    sqlite.transaction(() => {
      if (existing.adres_id) {
        sqlite.prepare(`UPDATE address SET straat=?,huisnummer=?,busnummer=?,postcode=?,stad=?,land=? WHERE addressid=?`).run(
          req.body.straat.trim(), req.body.huisnummer.trim(), emptyToNull(req.body.busnummer),
          req.body.postcode.trim(), req.body.stad.trim(), emptyToNull(req.body.land)||'Belgie', existing.adres_id);
      } else {
        const adr = sqlite.prepare(`INSERT INTO address (straat,huisnummer,busnummer,postcode,stad,land) VALUES (?,?,?,?,?,?)`).run(
          req.body.straat.trim(), req.body.huisnummer.trim(), emptyToNull(req.body.busnummer),
          req.body.postcode.trim(), req.body.stad.trim(), emptyToNull(req.body.land)||'Belgie');
        sqlite.prepare(`UPDATE klant SET adres_id=? WHERE klantid=?`).run(adr.lastInsertRowid, req.params.id);
      }
      sqlite.prepare(`UPDATE klant SET voornaam=?,achternaam=?,email=?,telefoon=?,type_klant=? WHERE klantid=?`).run(
        req.body.voornaam.trim(), req.body.achternaam.trim(), req.body.email.trim(),
        emptyToNull(req.body.telefoon), emptyToNull(req.body.type_klant), req.params.id);
    })();
    res.redirect('/klanten/'+req.params.id+'?success=Klant succesvol bijgewerkt.');
  } catch(e) { next(e); }
});

router.delete('/:id', (req, res, next) => {
  try {
    const klant = getKlantById(req.params.id);
    if (!klant) { const e = new Error('Klant niet gevonden.'); e.status=404; throw e; }
    const shoots = sqlite.prepare(`SELECT COUNT(*) AS n FROM fotoshoot WHERE klant_id=?`).get(req.params.id).n;
    if (shoots > 0) {
      return res.redirect(`/klanten/${req.params.id}?error=Kan niet verwijderen: deze klant heeft nog ${shoots} gekoppelde fotoshoot(s).`);
    }
    sqlite.prepare(`DELETE FROM klant WHERE klantid=?`).run(req.params.id);
    res.redirect('/klanten?success=Klant verwijderd.');
  } catch(e) { next(e); }
});

module.exports = router;
