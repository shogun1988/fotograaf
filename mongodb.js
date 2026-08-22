// ============================================
// MONGODB IMPORT SCRIPT — FOTOGRAAF SYSTEEM
// ============================================
// Gebruik: mongosh < mongodb.js
// Of:      mongosh "mongodb://localhost:27017" --file mongodb.js
// ============================================

const db = connect("mongodb://localhost:27017/fotograaf");

// Bestaande collecties verwijderen
db.klanten.drop();
db.pakketten.drop();
db.locaties.drop();
db.fotoshoots.drop();
db.facturen.drop();
db.betalingen.drop();
db.fotos.drop();
db.leveringen.drop();

print("Bestaande collecties verwijderd.");

// ============================================
// KLANTEN
// ============================================
db.klanten.insertMany([
  { _id: 1, voornaam: "Jan",   achternaam: "Peeters",   email: "jan.peeters@example.com",   telefoon: "0478123456", adres: "Kerkstraat 12, Gent",              type_klant: "particulier" },
  { _id: 2, voornaam: "Sara",  achternaam: "De Smet",   email: "sara.desmet@example.com",    telefoon: "0489123456", adres: "Stationsstraat 5, Antwerpen",      type_klant: "bedrijf" },
  { _id: 3, voornaam: "Sara",  achternaam: "De Smet",   email: "sara.desmet1@example.com",   telefoon: "0489123458", adres: "Klepelstraat 5, Antwerpen",        type_klant: "bedrijf" },
  { _id: 4, voornaam: "Tom",   achternaam: "Vermeulen", email: "tom.vermeulen@example.com",  telefoon: "0466123456", adres: "Markt 22, Brugge",                 type_klant: "particulier" },
  { _id: 5, voornaam: "Lies",  achternaam: "Van Damme", email: "lies.vandamme@example.com",  telefoon: "0499123456", adres: "Hoogstraat 88, Mechelen",          type_klant: "bedrijf" },
  { _id: 6, voornaam: "Peter", achternaam: "Jacobs",    email: "peter.jacobs@example.com",   telefoon: "0477123456", adres: "Lange Steenweg 10, Gent",          type_klant: "particulier" },
  { _id: 7, voornaam: "Nina",  achternaam: "Willems",   email: "nina.willems@example.com",   telefoon: "0487123456", adres: "Kouter 3, Gent",                   type_klant: "bedrijf" },
  { _id: 8, voornaam: "Ruben", achternaam: "Claes",     email: "ruben.claes@example.com",    telefoon: "0465123456", adres: "Veldstraat 99, Sint-Niklaas",      type_klant: "particulier" },
  { _id: 9, voornaam: "Emma",  achternaam: "Maes",      email: "emma.maes@example.com",      telefoon: "0498123456", adres: "Dorp 1, Lokeren",                  type_klant: "particulier" },
  { _id: 10, voornaam: "Louis", achternaam: "Goossens", email: "louis.goossens@example.com", telefoon: "0479123456", adres: "Parklaan 7, Gent",                 type_klant: "bedrijf" },
  { _id: 11, voornaam: "Julie", achternaam: "De Vos",   email: "julie.devos@example.com",    telefoon: "0486123456", adres: "Nieuwstraat 44, Aalst",            type_klant: "particulier" }
]);
print("✔ Klanten ingevoerd: " + db.klanten.countDocuments());

// ============================================
// PAKKETTEN
// ============================================
db.pakketten.insertMany([
  { _id: 1,  naam: "Basic",           beschrijving: "Kleine shoot, 10 foto's",           prijs: 99.00,   aantal_fotos_inbegrepen: 10,  levertijd_dagen: 3  },
  { _id: 2,  naam: "Premium",         beschrijving: "Uitgebreide shoot, 25 foto's",       prijs: 199.00,  aantal_fotos_inbegrepen: 25,  levertijd_dagen: 5  },
  { _id: 3,  naam: "Deluxe",          beschrijving: "Grote shoot, 50 foto's",             prijs: 349.00,  aantal_fotos_inbegrepen: 50,  levertijd_dagen: 7  },
  { _id: 4,  naam: "Event",           beschrijving: "Fotoshoot voor evenementen",         prijs: 499.00,  aantal_fotos_inbegrepen: 100, levertijd_dagen: 10 },
  { _id: 5,  naam: "Wedding Basic",   beschrijving: "Huwelijksreportage basis",           prijs: 799.00,  aantal_fotos_inbegrepen: 150, levertijd_dagen: 14 },
  { _id: 6,  naam: "Wedding Premium", beschrijving: "Huwelijksreportage premium",         prijs: 1299.00, aantal_fotos_inbegrepen: 300, levertijd_dagen: 21 },
  { _id: 7,  naam: "Portrait",        beschrijving: "Portretshoot",                       prijs: 149.00,  aantal_fotos_inbegrepen: 15,  levertijd_dagen: 4  },
  { _id: 8,  naam: "Family",          beschrijving: "Familieshoot",                       prijs: 249.00,  aantal_fotos_inbegrepen: 30,  levertijd_dagen: 5  },
  { _id: 9,  naam: "Business",        beschrijving: "Zakelijke foto's",                   prijs: 299.00,  aantal_fotos_inbegrepen: 40,  levertijd_dagen: 6  },
  { _id: 10, naam: "Product",         beschrijving: "Productfotografie",                  prijs: 199.00,  aantal_fotos_inbegrepen: 20,  levertijd_dagen: 4  }
]);
print("✔ Pakketten ingevoerd: " + db.pakketten.countDocuments());

// ============================================
// LOCATIES
// ============================================
db.locaties.insertMany([
  { _id: 1,  naam: "Studio Sint-Niklaas", adres: "Stationsstraat 10, Sint-Niklaas", type: "studio" },
  { _id: 2,  naam: "Park Gent",           adres: "Parklaan 1, Gent",               type: "buiten" },
  { _id: 3,  naam: "Kantoor Antwerpen",   adres: "Meir 22, Antwerpen",             type: "bedrijf" },
  { _id: 4,  naam: "Strand Oostende",     adres: "Zeedijk 100, Oostende",          type: "buiten" },
  { _id: 5,  naam: "Studio Antwerpen",    adres: "Kammenstraat 55, Antwerpen",     type: "studio" },
  { _id: 6,  naam: "Bos Lokeren",         adres: "Bosweg 12, Lokeren",             type: "buiten" },
  { _id: 7,  naam: "Kasteel Gaasbeek",    adres: "Kasteelstraat 1, Lennik",        type: "buiten" },
  { _id: 8,  naam: "Loft Brussel",        adres: "Zavelstraat 8, Brussel",         type: "binnen" },
  { _id: 9,  naam: "Studio Gent",         adres: "Korenmarkt 3, Gent",             type: "studio" },
  { _id: 10, naam: "Bedrijf Mechelen",    adres: "Industrieweg 20, Mechelen",      type: "bedrijf" }
]);
print("✔ Locaties ingevoerd: " + db.locaties.countDocuments());

// ============================================
// FOTOSHOOTS
// ============================================
db.fotoshoots.insertMany([
  { _id: 1,  klant_id: 1,  pakket_id: 1,  locatie_id: 1,  datum: new Date("2024-01-10"), starttijd: "10:00", eindtijd: "11:00", status: "gepland",   opmerkingen: "" },
  { _id: 2,  klant_id: 2,  pakket_id: 2,  locatie_id: 2,  datum: new Date("2024-01-12"), starttijd: "14:00", eindtijd: "16:00", status: "afgewerkt", opmerkingen: "Zeer goede shoot" },
  { _id: 3,  klant_id: 3,  pakket_id: 3,  locatie_id: 3,  datum: new Date("2024-01-15"), starttijd: "09:00", eindtijd: "12:00", status: "gepland",   opmerkingen: "" },
  { _id: 4,  klant_id: 4,  pakket_id: 4,  locatie_id: 4,  datum: new Date("2024-01-20"), starttijd: "13:00", eindtijd: "17:00", status: "gepland",   opmerkingen: "" },
  { _id: 5,  klant_id: 5,  pakket_id: 5,  locatie_id: 5,  datum: new Date("2024-01-22"), starttijd: "11:00", eindtijd: "18:00", status: "afgewerkt", opmerkingen: "Huwelijk" },
  { _id: 6,  klant_id: 6,  pakket_id: 6,  locatie_id: 6,  datum: new Date("2024-01-25"), starttijd: "08:00", eindtijd: "20:00", status: "gepland",   opmerkingen: "" },
  { _id: 7,  klant_id: 7,  pakket_id: 7,  locatie_id: 7,  datum: new Date("2024-01-28"), starttijd: "10:00", eindtijd: "12:00", status: "afgewerkt", opmerkingen: "" },
  { _id: 8,  klant_id: 8,  pakket_id: 8,  locatie_id: 8,  datum: new Date("2024-02-01"), starttijd: "15:00", eindtijd: "17:00", status: "gepland",   opmerkingen: "" },
  { _id: 9,  klant_id: 9,  pakket_id: 9,  locatie_id: 9,  datum: new Date("2024-02-05"), starttijd: "09:00", eindtijd: "11:00", status: "afgewerkt", opmerkingen: "" },
  { _id: 10, klant_id: 10, pakket_id: 10, locatie_id: 10, datum: new Date("2024-02-10"), starttijd: "10:00", eindtijd: "13:00", status: "gepland",   opmerkingen: "" }
]);
print("✔ Fotoshoots ingevoerd: " + db.fotoshoots.countDocuments());

// ============================================
// FACTUREN
// ============================================
db.facturen.insertMany([
  { _id: 1,  klant_id: 1,  fotoshoot_id: 1,  datum: new Date("2024-01-11"), totaalbedrag: 99.00,   status: "open"    },
  { _id: 2,  klant_id: 2,  fotoshoot_id: 2,  datum: new Date("2024-01-13"), totaalbedrag: 199.00,  status: "betaald" },
  { _id: 3,  klant_id: 3,  fotoshoot_id: 3,  datum: new Date("2024-01-16"), totaalbedrag: 349.00,  status: "open"    },
  { _id: 4,  klant_id: 4,  fotoshoot_id: 4,  datum: new Date("2024-01-21"), totaalbedrag: 499.00,  status: "open"    },
  { _id: 5,  klant_id: 5,  fotoshoot_id: 5,  datum: new Date("2024-01-23"), totaalbedrag: 799.00,  status: "betaald" },
  { _id: 6,  klant_id: 6,  fotoshoot_id: 6,  datum: new Date("2024-01-26"), totaalbedrag: 1299.00, status: "open"    },
  { _id: 7,  klant_id: 7,  fotoshoot_id: 7,  datum: new Date("2024-01-29"), totaalbedrag: 149.00,  status: "betaald" },
  { _id: 8,  klant_id: 8,  fotoshoot_id: 8,  datum: new Date("2024-02-02"), totaalbedrag: 249.00,  status: "open"    },
  { _id: 9,  klant_id: 9,  fotoshoot_id: 9,  datum: new Date("2024-02-06"), totaalbedrag: 299.00,  status: "betaald" },
  { _id: 10, klant_id: 10, fotoshoot_id: 10, datum: new Date("2024-02-11"), totaalbedrag: 199.00,  status: "open"    }
]);
print("✔ Facturen ingevoerd: " + db.facturen.countDocuments());

// ============================================
// BETALINGEN
// ============================================
db.betalingen.insertMany([
  { _id: 1,  factuur_id: 2, datum: new Date("2024-01-13"), bedrag: 199.00, methode: "bancontact"    },
  { _id: 2,  factuur_id: 3, datum: new Date("2024-01-16"), bedrag: 349.00, methode: "overschrijving" },
  { _id: 3,  factuur_id: 5, datum: new Date("2024-01-23"), bedrag: 799.00, methode: "overschrijving" },
  { _id: 4,  factuur_id: 7, datum: new Date("2024-01-29"), bedrag: 149.00, methode: "cash"           },
  { _id: 5,  factuur_id: 9, datum: new Date("2024-02-06"), bedrag: 299.00, methode: "visa"           },
  { _id: 6,  factuur_id: 2, datum: new Date("2024-01-14"), bedrag: 50.00,  methode: "bancontact"    },
  { _id: 7,  factuur_id: 5, datum: new Date("2024-01-23"), bedrag: 799.00, methode: "overschrijving" },
  { _id: 8,  factuur_id: 7, datum: new Date("2024-01-29"), bedrag: 149.00, methode: "cash"           },
  { _id: 9,  factuur_id: 9, datum: new Date("2024-02-06"), bedrag: 299.00, methode: "visa"           },
  { _id: 10, factuur_id: 2, datum: new Date("2024-01-14"), bedrag: 50.00,  methode: "bancontact"    },
  { _id: 11, factuur_id: 5, datum: new Date("2024-01-24"), bedrag: 100.00, methode: "overschrijving" },
  { _id: 12, factuur_id: 7, datum: new Date("2024-01-30"), bedrag: 20.00,  methode: "cash"           },
  { _id: 13, factuur_id: 9, datum: new Date("2024-02-07"), bedrag: 10.00,  methode: "visa"           },
  { _id: 14, factuur_id: 2, datum: new Date("2024-01-15"), bedrag: 30.00,  methode: "bancontact"    },
  { _id: 15, factuur_id: 5, datum: new Date("2024-01-25"), bedrag: 40.00,  methode: "overschrijving" }
]);
print("✔ Betalingen ingevoerd: " + db.betalingen.countDocuments());

// ============================================
// FOTOS
// ============================================
db.fotos.insertMany([
  { _id: 1,  fotoshoot_id: 10, bestandsnaam: "foto1.jpg",  resolutie: "4000x3000", formaat: "jpg", is_geselecteerd: true,  is_bewerkt: false },
  { _id: 2,  fotoshoot_id: 1,  bestandsnaam: "foto1.jpg",  resolutie: "4000x3000", formaat: "jpg", is_geselecteerd: true,  is_bewerkt: false },
  { _id: 3,  fotoshoot_id: 1,  bestandsnaam: "foto2.jpg",  resolutie: "4000x3000", formaat: "jpg", is_geselecteerd: false, is_bewerkt: false },
  { _id: 4,  fotoshoot_id: 2,  bestandsnaam: "foto3.jpg",  resolutie: "6000x4000", formaat: "jpg", is_geselecteerd: true,  is_bewerkt: true  },
  { _id: 5,  fotoshoot_id: 3,  bestandsnaam: "foto4.jpg",  resolutie: "4000x3000", formaat: "png", is_geselecteerd: true,  is_bewerkt: false },
  { _id: 6,  fotoshoot_id: 4,  bestandsnaam: "foto5.jpg",  resolutie: "4000x3000", formaat: "jpg", is_geselecteerd: false, is_bewerkt: false },
  { _id: 7,  fotoshoot_id: 5,  bestandsnaam: "foto6.jpg",  resolutie: "6000x4000", formaat: "jpg", is_geselecteerd: true,  is_bewerkt: true  },
  { _id: 8,  fotoshoot_id: 6,  bestandsnaam: "foto7.jpg",  resolutie: "4000x3000", formaat: "jpg", is_geselecteerd: true,  is_bewerkt: false },
  { _id: 9,  fotoshoot_id: 7,  bestandsnaam: "foto8.jpg",  resolutie: "4000x3000", formaat: "jpg", is_geselecteerd: false, is_bewerkt: false },
  { _id: 10, fotoshoot_id: 8,  bestandsnaam: "foto9.jpg",  resolutie: "6000x4000", formaat: "png", is_geselecteerd: true,  is_bewerkt: true  },
  { _id: 11, fotoshoot_id: 9,  bestandsnaam: "foto10.jpg", resolutie: "4000x3000", formaat: "jpg", is_geselecteerd: true,  is_bewerkt: false }
]);
print("✔ Foto's ingevoerd: " + db.fotos.countDocuments());

// ============================================
// LEVERINGEN
// ============================================
db.leveringen.insertMany([
  { _id: 1,  fotoshoot_id: 1,  leverdatum: new Date("2024-01-14"), type: "digitaal", download_link: "https://example.com/dl1",  aantal_prints: 0  },
  { _id: 2,  fotoshoot_id: 1,  leverdatum: new Date("2024-01-14"), type: "prints",   download_link: "https://example.com/dl1",  aantal_prints: 10 },
  { _id: 3,  fotoshoot_id: 2,  leverdatum: new Date("2024-01-15"), type: "digitaal", download_link: "https://example.com/dl2",  aantal_prints: 10 },
  { _id: 4,  fotoshoot_id: 3,  leverdatum: new Date("2024-01-18"), type: "prints",   download_link: "https://example.com/dl3",  aantal_prints: 20 },
  { _id: 5,  fotoshoot_id: 4,  leverdatum: new Date("2024-01-22"), type: "digitaal", download_link: "https://example.com/dl4",  aantal_prints: 0  },
  { _id: 6,  fotoshoot_id: 5,  leverdatum: new Date("2024-01-25"), type: "prints",   download_link: "https://example.com/dl5",  aantal_prints: 50 },
  { _id: 7,  fotoshoot_id: 6,  leverdatum: new Date("2024-01-28"), type: "digitaal", download_link: "https://example.com/dl6",  aantal_prints: 0  },
  { _id: 8,  fotoshoot_id: 7,  leverdatum: new Date("2024-01-30"), type: "digitaal", download_link: "https://example.com/dl7",  aantal_prints: 5  },
  { _id: 9,  fotoshoot_id: 8,  leverdatum: new Date("2024-02-03"), type: "prints",   download_link: "https://example.com/dl8",  aantal_prints: 15 },
  { _id: 10, fotoshoot_id: 9,  leverdatum: new Date("2024-02-07"), type: "digitaal", download_link: "https://example.com/dl9",  aantal_prints: 0  },
  { _id: 11, fotoshoot_id: 10, leverdatum: new Date("2024-02-12"), type: "prints",   download_link: "https://example.com/dl10", aantal_prints: 25 }
]);
print("✔ Leveringen ingevoerd: " + db.leveringen.countDocuments());

// ============================================
// INDEXEN voor betere queryprestaties
// ============================================
db.klanten.createIndex({ email: 1 }, { unique: true, name: "idx_klant_email" });
db.fotoshoots.createIndex({ klant_id: 1 }, { name: "idx_shoot_klant" });
db.fotoshoots.createIndex({ datum: 1 },    { name: "idx_shoot_datum" });
db.facturen.createIndex({ klant_id: 1 },   { name: "idx_factuur_klant" });
db.facturen.createIndex({ status: 1 },     { name: "idx_factuur_status" });
db.betalingen.createIndex({ factuur_id: 1 }, { name: "idx_betaling_factuur" });
db.fotos.createIndex({ fotoshoot_id: 1 },  { name: "idx_foto_shoot" });
db.leveringen.createIndex({ fotoshoot_id: 1 }, { name: "idx_levering_shoot" });

print("✔ Indexen aangemaakt.");
print("============================================");
print("✅ Import voltooid — database: fotograaf");
print("   Collecties: klanten, pakketten, locaties,");
print("               fotoshoots, facturen, betalingen,");
print("               fotos, leveringen");
print("============================================");
