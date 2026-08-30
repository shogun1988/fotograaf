const express = require('express');
const { sqlite } = require('../db/db');
const router = express.Router();

const emptyToNull = v => (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();

function loadFormData() {
  return {
    klanten: sqlite.prepare(`SELECT klantid, voornaam, achternaam FROM klant ORDER BY voornaam, achternaam`).all(),
    pakketten: sqlite.prepare(`SELECT pakketid, naam, prijs FROM pakket ORDER BY naam`).all(),
    locaties: sqlite.prepare(`SELECT locatieid, naam, type FROM locatie ORDER BY naam`).all()
  };
}

router.get('/', (req, res, next) => {
  try {
    const selectedStatus = emptyToNull(req.query.status);
    let fotoshoots;
    if (selectedStatus) {
      fotoshoots = sqlite.prepare(`
        SELECT f.fotoshootid, f.datum, f.starttijd, f.eindtijd, f.status,
               k.voornaam || ' ' || k.achternaam AS klant_naam,
               p.naam AS pakket_naam, l.naam AS locatie_naam
        FROM fotoshoot f
        LEFT JOIN klant k ON k.klantid = f.klant_id
        LEFT JOIN pakket p ON p.pakketid = f.pakket_id
        LEFT JOIN locatie l ON l.locatieid = f.locatie_id
        WHERE f.status = ?
        ORDER BY f.datum DESC, f.starttijd DESC, f.fotoshootid DESC`).all(selectedStatus);
    } else {
      fotoshoots = sqlite.prepare(`
        SELECT f.fotoshootid, f.datum, f.starttijd, f.eindtijd, f.status,
               k.voornaam || ' ' || k.achternaam AS klant_naam,
               p.naam AS pakket_naam, l.naam AS locatie_naam
        FROM fotoshoot f
        LEFT JOIN klant k ON k.klantid = f.klant_id
        LEFT JOIN pakket p ON p.pakketid = f.pakket_id
        LEFT JOIN locatie l ON l.locatieid = f.locatie_id
        ORDER BY f.datum DESC, f.starttijd DESC, f.fotoshootid DESC`).all();
    }
    res.render('fotoshoots/index', { title:'Fotoshoots', pageTitle:'Fotoshoots',
      pageSubtitle:'Volg planning, status en details van al je shoots.', fotoshoots, selectedStatus });
  } catch(e) { next(e); }
});

router.get('/new', (req, res, next) => {
  try {
    res.render('fotoshoots/new', { title:'Nieuwe fotoshoot', pageTitle:'Nieuwe fotoshoot',
      pageSubtitle:'Plan een nieuwe shoot en koppel de juiste klant, locatie en pakket.',
      fotoshoot:{ klant_id:'',pakket_id:'',locatie_id:'',datum:'',starttijd:'',eindtijd:'',status:'gepland',opmerkingen:'' },
      ...loadFormData() });
  } catch(e) { next(e); }
});

router.post('/', (req, res, next) => {
  try {
    const info = sqlite.prepare(`
      INSERT INTO fotoshoot (klant_id,pakket_id,locatie_id,datum,starttijd,eindtijd,status,opmerkingen)
      VALUES (?,?,?,?,?,?,?,?)`).run(
      Number(req.body.klant_id), Number(req.body.pakket_id), Number(req.body.locatie_id),
      emptyToNull(req.body.datum), emptyToNull(req.body.starttijd), emptyToNull(req.body.eindtijd),
      req.body.status.trim(), emptyToNull(req.body.opmerkingen));
    res.redirect('/fotoshoots/'+info.lastInsertRowid+'?success=Fotoshoot succesvol ingepland.');
  } catch(e) { next(e); }
});

router.get('/:id', (req, res, next) => {
  try {
    const fotoshoot = sqlite.prepare(`
      SELECT f.fotoshootid, f.datum, f.starttijd, f.eindtijd, f.status, f.opmerkingen,
             f.klant_id, f.pakket_id, f.locatie_id,
             k.voornaam || ' ' || k.achternaam AS klant_naam,
             k.email AS klant_email, k.telefoon AS klant_telefoon,
             p.naam AS pakket_naam, p.prijs AS pakket_prijs,
             p.aantal_fotos_inbegrepen, p.levertijd_dagen,
             l.naam AS locatie_naam, l.type AS locatie_type,
             a.straat, a.huisnummer, a.busnummer, a.postcode, a.stad, a.land
      FROM fotoshoot f
      LEFT JOIN klant k ON k.klantid = f.klant_id
      LEFT JOIN pakket p ON p.pakketid = f.pakket_id
      LEFT JOIN locatie l ON l.locatieid = f.locatie_id
      LEFT JOIN address a ON a.addressid = l.adres_id
      WHERE f.fotoshootid = ?`).get(req.params.id);
    if (!fotoshoot) { const e = new Error('Fotoshoot niet gevonden.'); e.status=404; throw e; }
    const facturen = sqlite.prepare(`
      SELECT factuurid, datum, totaalbedrag, status FROM factuur
      WHERE fotoshoot_id = ? ORDER BY datum DESC`).all(req.params.id);
    res.render('fotoshoots/show', { title:'Fotoshoot #'+fotoshoot.fotoshootid,
      pageTitle:'Fotoshoot #'+fotoshoot.fotoshootid,
      pageSubtitle:'Volledige details van deze shoot, inclusief klant, pakket en locatie.',
      fotoshoot, facturen });
  } catch(e) { next(e); }
});

router.get('/:id/edit', (req, res, next) => {
  try {
    const fotoshoot = sqlite.prepare(`SELECT * FROM fotoshoot WHERE fotoshootid=?`).get(req.params.id);
    if (!fotoshoot) { const e = new Error('Fotoshoot niet gevonden.'); e.status=404; throw e; }
    res.render('fotoshoots/edit', { title:'Fotoshoot bewerken', pageTitle:'Fotoshoot bewerken',
      pageSubtitle:'Pas datum, status of gekoppelde gegevens van deze shoot aan.',
      fotoshoot, ...loadFormData() });
  } catch(e) { next(e); }
});

router.put('/:id', (req, res, next) => {
  try {
    sqlite.prepare(`
      UPDATE fotoshoot SET klant_id=?,pakket_id=?,locatie_id=?,datum=?,starttijd=?,eindtijd=?,status=?,opmerkingen=?
      WHERE fotoshootid=?`).run(
      Number(req.body.klant_id), Number(req.body.pakket_id), Number(req.body.locatie_id),
      emptyToNull(req.body.datum), emptyToNull(req.body.starttijd), emptyToNull(req.body.eindtijd),
      req.body.status.trim(), emptyToNull(req.body.opmerkingen), req.params.id);
    res.redirect('/fotoshoots/'+req.params.id+'?success=Fotoshoot succesvol bijgewerkt.');
  } catch(e) { next(e); }
});

router.delete('/:id', (req, res, next) => {
  try {
    const facturen = sqlite.prepare(`SELECT COUNT(*) AS n FROM factuur WHERE fotoshoot_id=?`).get(req.params.id).n;
    if (facturen > 0) {
      return res.redirect(`/fotoshoots/${req.params.id}?error=Kan niet verwijderen: deze shoot heeft nog ${facturen} gekoppelde factuur(en). Verwijder die eerst.`);
    }
    sqlite.prepare(`DELETE FROM fotoshoot WHERE fotoshootid=?`).run(req.params.id);
    res.redirect('/fotoshoots?success=Fotoshoot verwijderd.');
  } catch(e) { next(e); }
});

module.exports = router;
