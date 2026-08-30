// ============================================
// SQLite seed script — Fotograaf systeem
// Gebruik: node db/seed.js
// ============================================

const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'fotograaf.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('Database aanmaken:', DB_PATH);

db.exec(`
DROP TABLE IF EXISTS levering;
DROP TABLE IF EXISTS foto;
DROP TABLE IF EXISTS betaling;
DROP TABLE IF EXISTS factuur;
DROP TABLE IF EXISTS fotoshoot;
DROP TABLE IF EXISTS locatie;
DROP TABLE IF EXISTS pakket;
DROP TABLE IF EXISTS klant;
DROP TABLE IF EXISTS address;

CREATE TABLE address (
  addressid   INTEGER PRIMARY KEY AUTOINCREMENT,
  straat      TEXT NOT NULL,
  huisnummer  TEXT NOT NULL,
  busnummer   TEXT,
  postcode    TEXT NOT NULL,
  stad        TEXT NOT NULL,
  land        TEXT NOT NULL DEFAULT 'Belgie'
);

CREATE TABLE klant (
  klantid    INTEGER PRIMARY KEY AUTOINCREMENT,
  voornaam   TEXT NOT NULL,
  achternaam TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  telefoon   TEXT,
  adres_id   INTEGER REFERENCES address(addressid),
  type_klant TEXT
);

CREATE TABLE pakket (
  pakketid                INTEGER PRIMARY KEY AUTOINCREMENT,
  naam                    TEXT    NOT NULL,
  beschrijving            TEXT,
  prijs                   REAL    NOT NULL,
  aantal_fotos_inbegrepen INTEGER,
  levertijd_dagen         INTEGER
);

CREATE TABLE locatie (
  locatieid INTEGER PRIMARY KEY AUTOINCREMENT,
  naam      TEXT NOT NULL,
  adres_id  INTEGER REFERENCES address(addressid),
  type      TEXT
);

CREATE TABLE fotoshoot (
  fotoshootid INTEGER PRIMARY KEY AUTOINCREMENT,
  klant_id    INTEGER REFERENCES klant(klantid),
  pakket_id   INTEGER REFERENCES pakket(pakketid),
  locatie_id  INTEGER REFERENCES locatie(locatieid),
  datum       TEXT,
  starttijd   TEXT,
  eindtijd    TEXT,
  status      TEXT,
  opmerkingen TEXT
);

CREATE TABLE factuur (
  factuurid    INTEGER PRIMARY KEY AUTOINCREMENT,
  klant_id     INTEGER REFERENCES klant(klantid),
  fotoshoot_id INTEGER REFERENCES fotoshoot(fotoshootid),
  datum        TEXT,
  totaalbedrag REAL,
  status       TEXT
);

CREATE TABLE betaling (
  betalingid INTEGER PRIMARY KEY AUTOINCREMENT,
  factuur_id INTEGER REFERENCES factuur(factuurid),
  datum      TEXT,
  bedrag     REAL,
  methode    TEXT
);

CREATE TABLE foto (
  fotoid          INTEGER PRIMARY KEY AUTOINCREMENT,
  fotoshoot_id    INTEGER REFERENCES fotoshoot(fotoshootid),
  bestandsnaam    TEXT,
  resolutie       TEXT,
  formaat         TEXT,
  is_geselecteerd INTEGER,
  is_bewerkt      INTEGER
);

CREATE TABLE levering (
  leveringid    INTEGER PRIMARY KEY AUTOINCREMENT,
  fotoshoot_id  INTEGER REFERENCES fotoshoot(fotoshootid),
  leverdatum    TEXT,
  type          TEXT,
  download_link TEXT,
  aantal_prints INTEGER
);
`);

const ins = (tbl, cols) => db.prepare(`INSERT INTO ${tbl} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`);

// Addresses
const iAddr = ins('address', ['straat','huisnummer','busnummer','postcode','stad','land']);
const addresses = [
  ['Kerkstraat','12',null,'9000','Gent','Belgie'],
  ['Stationsstraat','5',null,'2000','Antwerpen','Belgie'],
  ['Klepelstraat','5',null,'2000','Antwerpen','Belgie'],
  ['Markt','22',null,'8000','Brugge','Belgie'],
  ['Hoogstraat','88',null,'2800','Mechelen','Belgie'],
  ['Lange Steenweg','10',null,'9000','Gent','Belgie'],
  ['Kouter','3',null,'9000','Gent','Belgie'],
  ['Veldstraat','99',null,'9100','Sint-Niklaas','Belgie'],
  ['Dorp','1',null,'9160','Lokeren','Belgie'],
  ['Parklaan','7',null,'9000','Gent','Belgie'],
  ['Nieuwstraat','44',null,'9300','Aalst','Belgie'],
  ['Stationsstraat','10',null,'9100','Sint-Niklaas','Belgie'],
  ['Meir','22',null,'2000','Antwerpen','Belgie'],
  ['Zeedijk','100',null,'8400','Oostende','Belgie'],
  ['Kammenstraat','55',null,'2000','Antwerpen','Belgie'],
  ['Bosweg','12',null,'9160','Lokeren','Belgie'],
  ['Kasteelstraat','1',null,'1750','Lennik','Belgie'],
  ['Zavelstraat','8',null,'1000','Brussel','Belgie'],
  ['Korenmarkt','3',null,'9000','Gent','Belgie'],
  ['Industrieweg','20',null,'2800','Mechelen','Belgie'],
];
db.transaction(rows => rows.forEach(r => iAddr.run(...r)))(addresses);

const iKlant = ins('klant',['voornaam','achternaam','email','telefoon','adres_id','type_klant']);
const klanten = [
  ['Jan','Peeters','jan.peeters@example.com','0478123456',1,'particulier'],
  ['Sara','De Smet','sara.desmet@example.com','0489123456',2,'bedrijf'],
  ['Sara','De Smet','sara.desmet1@example.com','0489123458',3,'bedrijf'],
  ['Tom','Vermeulen','tom.vermeulen@example.com','0466123456',4,'particulier'],
  ['Lies','Van Damme','lies.vandamme@example.com','0499123456',5,'bedrijf'],
  ['Peter','Jacobs','peter.jacobs@example.com','0477123456',6,'particulier'],
  ['Nina','Willems','nina.willems@example.com','0487123456',7,'bedrijf'],
  ['Ruben','Claes','ruben.claes@example.com','0465123456',8,'particulier'],
  ['Emma','Maes','emma.maes@example.com','0498123456',9,'particulier'],
  ['Louis','Goossens','louis.goossens@example.com','0479123456',10,'bedrijf'],
  ['Julie','De Vos','julie.devos@example.com','0486123456',11,'particulier'],
];
db.transaction(rows => rows.forEach(r => iKlant.run(...r)))(klanten);

const iPakket = ins('pakket',['naam','beschrijving','prijs','aantal_fotos_inbegrepen','levertijd_dagen']);
const pakketten = [
  ['Basic',"Kleine shoot, 10 foto's",99,10,3],
  ['Premium',"Uitgebreide shoot, 25 foto's",199,25,5],
  ['Deluxe',"Grote shoot, 50 foto's",349,50,7],
  ['Event','Fotoshoot voor evenementen',499,100,10],
  ['Wedding Basic','Huwelijksreportage basis',799,150,14],
  ['Wedding Premium','Huwelijksreportage premium',1299,300,21],
  ['Portrait','Portretshoot',149,15,4],
  ['Family','Familieshoot',249,30,5],
  ['Business',"Zakelijke foto's",299,40,6],
  ['Product','Productfotografie',199,20,4],
];
db.transaction(rows => rows.forEach(r => iPakket.run(...r)))(pakketten);

const iLoc = ins('locatie',['naam','adres_id','type']);
const locaties = [
  ['Studio Sint-Niklaas',12,'studio'],
  ['Park Gent',10,'buiten'],
  ['Kantoor Antwerpen',13,'bedrijf'],
  ['Strand Oostende',14,'buiten'],
  ['Studio Antwerpen',15,'studio'],
  ['Bos Lokeren',16,'buiten'],
  ['Kasteel Gaasbeek',17,'buiten'],
  ['Loft Brussel',18,'binnen'],
  ['Studio Gent',19,'studio'],
  ['Bedrijf Mechelen',20,'bedrijf'],
];
db.transaction(rows => rows.forEach(r => iLoc.run(...r)))(locaties);

const iShoot = ins('fotoshoot',['klant_id','pakket_id','locatie_id','datum','starttijd','eindtijd','status','opmerkingen']);
const shoots = [
  [1,1,1,'2024-01-10','10:00','11:00','gepland',''],
  [2,2,2,'2024-01-12','14:00','16:00','afgewerkt','Zeer goede shoot'],
  [3,3,3,'2024-01-15','09:00','12:00','gepland',''],
  [4,4,4,'2024-01-20','13:00','17:00','gepland',''],
  [5,5,5,'2024-01-22','11:00','18:00','afgewerkt','Huwelijk'],
  [6,6,6,'2024-01-25','08:00','20:00','gepland',''],
  [7,7,7,'2024-01-28','10:00','12:00','afgewerkt',''],
  [8,8,8,'2024-02-01','15:00','17:00','gepland',''],
  [9,9,9,'2024-02-05','09:00','11:00','afgewerkt',''],
  [10,10,10,'2024-02-10','10:00','13:00','gepland',''],
];
db.transaction(rows => rows.forEach(r => iShoot.run(...r)))(shoots);

const iFact = ins('factuur',['klant_id','fotoshoot_id','datum','totaalbedrag','status']);
const facturen = [
  [1,1,'2024-01-11',99,'open'],
  [2,2,'2024-01-13',199,'betaald'],
  [3,3,'2024-01-16',349,'open'],
  [4,4,'2024-01-21',499,'open'],
  [5,5,'2024-01-23',799,'betaald'],
  [6,6,'2024-01-26',1299,'open'],
  [7,7,'2024-01-29',149,'betaald'],
  [8,8,'2024-02-02',249,'open'],
  [9,9,'2024-02-06',299,'betaald'],
  [10,10,'2024-02-11',199,'open'],
];
db.transaction(rows => rows.forEach(r => iFact.run(...r)))(facturen);

const iBet = ins('betaling',['factuur_id','datum','bedrag','methode']);
const betalingen = [
  [2,'2024-01-13',199,'bancontact'],
  [3,'2024-01-16',349,'overschrijving'],
  [5,'2024-01-23',799,'overschrijving'],
  [7,'2024-01-29',149,'cash'],
  [9,'2024-02-06',299,'visa'],
  [1,'2024-01-12',50,'bancontact'],
  [4,'2024-01-22',250,'overschrijving'],
  [6,'2024-01-27',650,'overschrijving'],
  [8,'2024-02-03',249,'visa'],
  [10,'2024-02-12',199,'bancontact'],
];
db.transaction(rows => rows.forEach(r => iBet.run(...r)))(betalingen);

const iFoto = ins('foto',['fotoshoot_id','bestandsnaam','resolutie','formaat','is_geselecteerd','is_bewerkt']);
const fotos = [
  [1,'shoot1_foto1.jpg','4000x3000','jpg',1,0],
  [1,'shoot1_foto2.jpg','4000x3000','jpg',0,0],
  [2,'shoot2_foto1.jpg','6000x4000','jpg',1,1],
  [2,'shoot2_foto2.jpg','6000x4000','jpg',1,1],
  [3,'shoot3_foto1.jpg','4000x3000','png',1,0],
  [4,'shoot4_foto1.jpg','4000x3000','jpg',0,0],
  [5,'shoot5_foto1.jpg','6000x4000','jpg',1,1],
  [6,'shoot6_foto1.jpg','4000x3000','jpg',1,0],
  [7,'shoot7_foto1.jpg','4000x3000','jpg',0,0],
  [8,'shoot8_foto1.jpg','6000x4000','png',1,1],
  [9,'shoot9_foto1.jpg','4000x3000','jpg',1,0],
  [10,'shoot10_foto1.jpg','4000x3000','jpg',1,0],
];
db.transaction(rows => rows.forEach(r => iFoto.run(...r)))(fotos);

const iLev = ins('levering',['fotoshoot_id','leverdatum','type','download_link','aantal_prints']);
const leveringen = [
  [1,'2024-01-14','prints','https://example.com/dl1',10],
  [2,'2024-01-17','digitaal','https://example.com/dl2',0],
  [3,'2024-01-19','digitaal','https://example.com/dl3',0],
  [4,'2024-01-25','prints','https://example.com/dl4',20],
  [5,'2024-02-05','digitaal','https://example.com/dl5',0],
  [6,'2024-02-01','prints','https://example.com/dl6',30],
  [7,'2024-02-02','digitaal','https://example.com/dl7',0],
  [8,'2024-02-07','prints','https://example.com/dl8',15],
  [9,'2024-02-10','digitaal','https://example.com/dl9',0],
  [10,'2024-02-15','digitaal','https://example.com/dl10',0],
];
db.transaction(rows => rows.forEach(r => iLev.run(...r)))(leveringen);

console.log('Seed klaar! Database opgeslagen in:', DB_PATH);
db.close();
