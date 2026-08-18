-- ============================================
-- DATABASE STRUCTUUR VOOR FOTOGRAAF-SYSTEEM
-- ============================================

-- Verwijder bestaande tabellen in juiste volgorde
DROP TABLE IF EXISTS Levering CASCADE;
DROP TABLE IF EXISTS Foto CASCADE;
DROP TABLE IF EXISTS Betaling CASCADE;
DROP TABLE IF EXISTS Factuur CASCADE;
DROP TABLE IF EXISTS Fotoshoot CASCADE;
DROP TABLE IF EXISTS Locatie CASCADE;
DROP TABLE IF EXISTS Pakket CASCADE;
DROP TABLE IF EXISTS Klant CASCADE;

-- ============================================
-- TABEL: Klant
-- ============================================
CREATE TABLE Klant (
    KlantID SERIAL PRIMARY KEY,
    voornaam VARCHAR(50),
    achternaam VARCHAR(50),
    email VARCHAR(100),
    telefoon VARCHAR(20),
    adres VARCHAR(200),
    type_klant VARCHAR(50)
);

INSERT INTO Klant (voornaam, achternaam, email, telefoon, adres, type_klant) VALUES
('Jan', 'Peeters', 'jan.peeters@example.com', '0478123456', 'Kerkstraat 12, Gent', 'particulier'),
('Sara', 'De Smet', 'sara.desmet@example.com', '0489123456', 'Stationsstraat 5, Antwerpen', 'bedrijf'),
('Sara', 'De Smet', 'sara.desmet1@example.com', '0489123458', 'klepelstraat 5, Antwerpen', 'bedrijf'),
('Tom', 'Vermeulen', 'tom.vermeulen@example.com', '0466123456', 'Markt 22, Brugge', 'particulier'),
('Lies', 'Van Damme', 'lies.vandamme@example.com', '0499123456', 'Hoogstraat 88, Mechelen', 'bedrijf'),
('Peter', 'Jacobs', 'peter.jacobs@example.com', '0477123456', 'Lange Steenweg 10, Gent', 'particulier'),
('Nina', 'Willems', 'nina.willems@example.com', '0487123456', 'Kouter 3, Gent', 'bedrijf'),
('Ruben', 'Claes', 'ruben.claes@example.com', '0465123456', 'Veldstraat 99, Sint-Niklaas', 'particulier'),
('Emma', 'Maes', 'emma.maes@example.com', '0498123456', 'Dorp 1, Lokeren', 'particulier'),
('Louis', 'Goossens', 'louis.goossens@example.com', '0479123456', 'Parklaan 7, Gent', 'bedrijf'),
('Julie', 'De Vos', 'julie.devos@example.com', '0486123456', 'Nieuwstraat 44, Aalst', 'particulier');


-- ============================================
-- TABEL: Pakket
-- ============================================
CREATE TABLE Pakket (
    PakketID SERIAL PRIMARY KEY,
    naam VARCHAR(50),
    beschrijving TEXT,
    prijs NUMERIC(10,2),
    aantal_fotos_inbegrepen INT,
    levertijd_dagen INT
);

INSERT INTO Pakket (naam, beschrijving, prijs, aantal_fotos_inbegrepen, levertijd_dagen) VALUES
('Basic', 'Kleine shoot, 10 foto’s', 99.00, 10, 3),
('Premium', 'Uitgebreide shoot, 25 foto’s', 199.00, 25, 5),
('Deluxe', 'Grote shoot, 50 foto’s', 349.00, 50, 7),
('Event', 'Fotoshoot voor evenementen', 499.00, 100, 10),
('Wedding Basic', 'Huwelijksreportage basis', 799.00, 150, 14),
('Wedding Premium', 'Huwelijksreportage premium', 1299.00, 300, 21),
('Portrait', 'Portretshoot', 149.00, 15, 4),
('Family', 'Familieshoot', 249.00, 30, 5),
('Business', 'Zakelijke foto’s', 299.00, 40, 6),
('Product', 'Productfotografie', 199.00, 20, 4);
('Premium', 'Uitgebreide shoot, 25 foto’s', 199.00, 25, 5),
('Deluxe', 'Grote shoot, 50 foto’s', 349.00, 50, 7),
('Event', 'Fotoshoot voor evenementen', 499.00, 100, 10),
('Wedding Basic', 'Huwelijksreportage basis', 799.00, 150, 14),
('Wedding Premium', 'Huwelijksreportage premium', 1299.00, 300, 21),
('Portrait', 'Portretshoot', 149.00, 15, 4),
('Family', 'Familieshoot', 249.00, 30, 5),
('Business', 'Zakelijke foto’s', 299.00, 40, 6),
('Product', 'Productfotografie', 199.00, 20, 4);

-- ============================================
-- TABEL: Locatie
-- ============================================
CREATE TABLE Locatie (
    LocatieID SERIAL PRIMARY KEY,
    naam VARCHAR(100),
    adres VARCHAR(200),
    type VARCHAR(50)
);

INSERT INTO Locatie (naam, adres, type) VALUES
('Studio Sint-Niklaas', 'Stationsstraat 10, Sint-Niklaas', 'studio'),
('Park Gent', 'Parklaan 1, Gent', 'buiten'),
('Kantoor Antwerpen', 'Meir 22, Antwerpen', 'bedrijf'),
('Strand Oostende', 'Zeedijk 100, Oostende', 'buiten'),
('Studio Antwerpen', 'Kammenstraat 55, Antwerpen', 'studio'),
('Bos Lokeren', 'Bosweg 12, Lokeren', 'buiten'),
('Kasteel Gaasbeek', 'Kasteelstraat 1, Lennik', 'buiten'),
('Loft Brussel', 'Zavelstraat 8, Brussel', 'binnen'),
('Studio Gent', 'Korenmarkt 3, Gent', 'studio'),
('Bedrijf Mechelen', 'Industrieweg 20, Mechelen', 'bedrijf');
('Park Gent', 'Parklaan 1, Gent', 'buiten'),
('Kantoor Antwerpen', 'Meir 22, Antwerpen', 'bedrijf'),
('Strand Oostende', 'Zeedijk 100, Oostende', 'buiten'),
('Studio Antwerpen', 'Kammenstraat 55, Antwerpen', 'studio'),
('Bos Lokeren', 'Bosweg 12, Lokeren', 'buiten'),
('Kasteel Gaasbeek', 'Kasteelstraat 1, Lennik', 'buiten'),
('Loft Brussel', 'Zavelstraat 8, Brussel', 'binnen'),
('Studio Gent', 'Korenmarkt 3, Gent', 'studio'),
('Bedrijf Mechelen', 'Industrieweg 20, Mechelen', 'bedrijf');

-- ============================================
-- TABEL: Fotoshoot
-- ============================================database
CREATE TABLE Fotoshoot (
    FotoshootID SERIAL PRIMARY KEY,
    klant_id INT REFERENCES Klant(KlantID),
    pakket_id INT REFERENCES Pakket(PakketID),
    locatie_id INT REFERENCES Locatie(LocatieID),
    datum DATE,
    starttijd TIME,
    eindtijd TIME,
    status VARCHAR(50),
    opmerkingen TEXT
);

INSERT INTO Fotoshoot (klant_id, pakket_id, locatie_id, datum, starttijd, eindtijd, status, opmerkingen) VALUES
(1,1,1,'2024-01-10','10:00','11:00','gepland',''),
(2,2,2,'2024-01-12','14:00','16:00','afgewerkt','Zeer goede shoot'),
(3,3,3,'2024-01-15','09:00','12:00','gepland',''),
(4,4,4,'2024-01-20','13:00','17:00','gepland',''),
(5,5,5,'2024-01-22','11:00','18:00','afgewerkt','Huwelijk'),
(6,6,6,'2024-01-25','08:00','20:00','gepland',''),
(7,7,7,'2024-01-28','10:00','12:00','afgewerkt',''),
(8,8,8,'2024-02-01','15:00','17:00','gepland',''),
(9,9,9,'2024-02-05','09:00','11:00','afgewerkt',''),
(10,10,10,'2024-02-10','10:00','13:00','gepland','');
(2,2,2,'2024-01-12','14:00','16:00','afgewerkt','Zeer goede shoot'),
(3,3,3,'2024-01-15','09:00','12:00','gepland',''),
(4,4,4,'2024-01-20','13:00','17:00','gepland',''),
(5,5,5,'2024-01-22','11:00','18:00','afgewerkt','Huwelijk'),
(6,6,6,'2024-01-25','08:00','20:00','gepland',''),
(7,7,7,'2024-01-28','10:00','12:00','afgewerkt',''),
(8,8,8,'2024-02-01','15:00','17:00','gepland',''),
(9,9,9,'2024-02-05','09:00','11:00','afgewerkt',''),
(10,10,10,'2024-02-10','10:00','13:00','gepland','');

-- ============================================
-- TABEL: Factuur
-- ============================================
CREATE TABLE Factuur (
    FactuurID SERIAL PRIMARY KEY,
    klant_id INT REFERENCES Klant(KlantID),
    fotoshoot_id INT REFERENCES Fotoshoot(FotoshootID),
    datum DATE,
    totaalbedrag NUMERIC(10,2),
    status VARCHAR(50)
);

INSERT INTO Factuur (klant_id, fotoshoot_id, datum, totaalbedrag, status) VALUES
(1,1,'2024-01-11',99.00,'open'),
(2,2,'2024-01-13',199.00,'betaald'),
(3,3,'2024-01-16',349.00,'open'),
(4,4,'2024-01-21',499.00,'open'),
(5,5,'2024-01-23',799.00,'betaald'),
(6,6,'2024-01-26',1299.00,'open'),
(7,7,'2024-01-29',149.00,'betaald'),
(8,8,'2024-02-02',249.00,'open'),
(9,9,'2024-02-06',299.00,'betaald'),
(10,10,'2024-02-11',199.00,'open');
(2,2,'2024-01-13',199.00,'betaald'),
(3,3,'2024-01-16',349.00,'open'),
(4,4,'2024-01-21',499.00,'open'),
(5,5,'2024-01-23',799.00,'betaald'),
(6,6,'2024-01-26',1299.00,'open'),
(7,7,'2024-01-29',149.00,'betaald'),
(8,8,'2024-02-02',249.00,'open'),
(9,9,'2024-02-06',299.00,'betaald'),
(10,10,'2024-02-11',199.00,'open');

-- ============================================
-- TABEL: Betaling
-- ============================================
CREATE TABLE Betaling (
    BetalingID SERIAL PRIMARY KEY,
    factuur_id INT REFERENCES Factuur(FactuurID),
    datum DATE,
    bedrag NUMERIC(10,2),
    methode VARCHAR(50)
);

INSERT INTO Betaling (factuur_id, datum, bedrag, methode) VALUES
(2,'2024-01-13',199.00,'bancontact'),
(3,'2024-01-16',349.00,'overschrijving'),
(5,'2024-01-23',799.00,'overschrijving'),
(7,'2024-01-29',149.00,'cash'),
(9,'2024-02-06',299.00,'visa'),
(2,'2024-01-14',50.00,'bancontact'),
(5,'2024-01-23',799.00,'overschrijving'),
(7,'2024-01-29',149.00,'cash'),
(9,'2024-02-06',299.00,'visa'),
(2,'2024-01-14',50.00,'bancontact'),
(5,'2024-01-24',100.00,'overschrijving'),
(7,'2024-01-30',20.00,'cash'),
(9,'2024-02-07',10.00,'visa'),
(2,'2024-01-15',30.00,'bancontact'),
(5,'2024-01-25',40.00,'overschrijving');

-- ============================================
-- TABEL: Foto
-- ============================================
CREATE TABLE Foto (
    FotoID SERIAL PRIMARY KEY,
    fotoshoot_id INT REFERENCES Fotoshoot(FotoshootID),
    bestandsnaam VARCHAR(200),
    resolutie VARCHAR(50),
    formaat VARCHAR(20),
    is_geselecteerd BOOLEAN,
    is_bewerkt BOOLEAN
);

INSERT INTO Foto (fotoshoot_id, bestandsnaam, resolutie, formaat, is_geselecteerd, is_bewerkt) VALUES
(1,'foto1.jpg','4000x3000','jpg',true,false),
(1,'foto1.jpg','4000x3000','jpg',true,false),
(1,'foto2.jpg','4000x3000','jpg',false,false),
(2,'foto3.jpg','6000x4000','jpg',true,true),
(3,'foto4.jpg','4000x3000','png',true,false),
(4,'foto5.jpg','4000x3000','jpg',false,false),
(5,'foto6.jpg','6000x4000','jpg',true,true),
(6,'foto7.jpg','4000x3000','jpg',true,false),
(7,'foto8.jpg','4000x3000','jpg',false,false),
(8,'foto9.jpg','6000x4000','png',true,true),
(9,'foto10.jpg','4000x3000','jpg',true,false);

-- ============================================
-- TABEL: Levering
-- ============================================
CREATE TABLE Levering (
    LeveringID SERIAL PRIMARY KEY,
    fotoshoot_id INT REFERENCES Fotoshoot(FotoshootID),
    leverdatum DATE,
    type VARCHAR(50),
    download_link VARCHAR(200),
    aantal_prints INT
);

INSERT INTO Levering (fotoshoot_id, leverdatum, type, download_link, aantal_prints) VALUES
(1,'2024-01-14','digitaal','https://example.com/dl1',0),
(1,'2024-01-14','prints','https://example.com/dl1',10), 
(2,'2024-01-15','digitaal','https://example.com/dl2',10),
(3,'2024-01-18','prints','https://example.com/dl3',20),
(4,'2024-01-22','digitaal','https://example.com/dl4',0),
(5,'2024-01-25','prints','https://example.com/dl5',50),
(6,'2024-01-28','digitaal','https://example.com/dl6',0),
(7,'2024-01-30','digitaal','https://example.com/dl7',5),
(8,'2024-02-03','prints','https://example.com/dl8',15),
(9,'2024-02-07','digitaal','https://example.com/dl9',0),
(10,'2024-02-12','prints','https://example.com/dl10',25);
