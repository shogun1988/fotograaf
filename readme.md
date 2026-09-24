# 📷 Fotograaf Webapp

> **Een eenvoudige online werkplek voor fotografen.**  
> Beheer klanten, plan fotoshoots en houd facturen bij op één plaats.

---

## 🧭 Volg deze volgorde

Gebruik je de app voor het eerst? Volg deze stappen van boven naar beneden:

1. Installeer eerst **Git** en **Node.js** op je computer.
2. Download de app van GitHub.
3. Bereid de app eenmalig voor.
4. Start de app en open ze in je browser.
5. Log in.
6. Gebruik de verschillende onderdelen, zoals klanten en fotoshoots.

> ℹ️ Je hoeft geen programmeur te zijn. Volg de stappen gewoon één voor één.

---

## 🛠️ De app voor de eerste keer installeren

Gebruik deze uitleg als je de app voor de eerste keer op je computer installeert.

### 1. Installeer Git

**Git** is een programma waarmee je het project van GitHub naar je computer kunt downloaden.

1. Ga naar [git-scm.com/download/win](https://git-scm.com/download/win).
2. Download en open het installatiebestand.
3. Volg de stappen op het scherm. Je mag de standaardkeuzes laten staan.
4. Sluit en open je terminal opnieuw nadat de installatie klaar is.

### 2. Installeer Node.js

De app heeft **Node.js** nodig om te kunnen werken.

1. Ga naar [nodejs.org](https://nodejs.org/).
2. Download de versie met de aanduiding **LTS**.
3. Open het gedownloade bestand en volg de stappen op het scherm.
4. Sluit en open je terminal opnieuw nadat de installatie klaar is.

### 3. Download het project van GitHub

1. Maak of kies een map waarin je het project wilt bewaren, bijvoorbeeld `Documenten`.
2. Open die map in Verkenner.
3. Typ `cmd` in de adresbalk bovenaan en druk op **Enter**.
4. Typ deze opdracht en druk op **Enter**:

```text
git clone https://github.com/shogun1988/fotograaf.git
```

Wacht tot het downloaden klaar is. Er verschijnt daarna een nieuwe map met de naam `fotograaf`.

> ℹ️ **Wat is een terminal?**  
> Een terminal is een venster waarin je korte opdrachten kunt typen. In Windows kun je in Verkenner naar de map gaan, in de adresbalk `cmd` typen en op **Enter** drukken.

### 4. Open de juiste map

Open een terminal en typ onderstaande opdracht. Druk daarna op **Enter**:

```text
cd D:\fotograaf\app
```

> ℹ️ Staat het project op een andere plaats? Vervang dan `D:\fotograaf\app` door de locatie van jouw map `app`.

### 5. Bereid de app voor

Typ deze opdracht en druk op **Enter**:

```text
npm install
```

Wacht tot de opdracht klaar is. Dit kan bij de eerste keer enkele minuten duren.

### 6. Start de app

Typ daarna:

```text
node server.js
```

Wanneer je de melding ziet dat de webapp draait, is alles in orde.

### 7. Open de app

Open Chrome, Edge of een andere browser en ga naar:

**[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Log in op de app

Gebruik op het inlogscherm deze gegevens:

| Wat heb je nodig? | In te vullen waarde |
| --- | --- |
| Gebruikersnaam | `demo` |
| Wachtwoord | `test123test` |

> 🔒 **Tip:** Wijzig het wachtwoord na je eerste keer inloggen via **Mijn account**.

---

## ✨ Zo gebruik je de app

Na het inloggen kom je op het dashboard. Hieronder staat een eenvoudige, logische volgorde om te beginnen.

### 1. Voeg eerst je pakketten toe

Ga naar **Pakketten** en voeg je formules toe, bijvoorbeeld een portretshoot, familieshoot of huwelijksreportage. Vul de prijs en een korte uitleg in.

### 2. Voeg je locaties toe

Ga naar **Locaties** en voeg plaatsen toe waar je vaak fotografeert, zoals je studio, een park of een klantlocatie.

### 3. Voeg een klant toe

Ga naar **Klanten** en kies **Nieuwe klant**. Vul naam, e-mailadres, telefoonnummer en adres in. Sla de gegevens op.

### 4. Plan een fotoshoot

Ga naar **Fotoshoots** en kies **Nieuwe fotoshoot**. Kies de klant, het pakket, de locatie, datum en tijd. Daarna kun je de fotoshoot opslaan.

### 5. Bekijk of maak een factuur

Ga naar **Facturen** om openstaande en betaalde facturen te bekijken. Controleer bij een betaling of de status correct staat.

> 💡 Begin bij een nieuwe klant altijd met **klant toevoegen** en maak daarna de bijbehorende **fotoshoot** aan.

---

## ❓ Hulp bij veelvoorkomende vragen

### De pagina opent niet

Controleer of de terminal nog openstaat en of je eerst `node server.js` hebt uitgevoerd. Probeer vervolgens de pagina in je browser opnieuw te laden.

### Hoe sluit ik de app af?

Ga terug naar het terminalvenster en druk tegelijk op:

```text
Ctrl + C
```

### Hoe start ik de app later opnieuw?

1. Open een terminal in de map `D:\fotograaf\app`.
2. Typ `node server.js`.
3. Open [http://localhost:3000](http://localhost:3000) in je browser.

> 💡 `npm install` hoef je normaal maar één keer uit te voeren: bij de eerste installatie.

### In welke volgorde gebruik ik de app?

Gebruik bij een nieuwe opdracht deze eenvoudige volgorde:

1. Voeg de klant toe.
2. Plan de fotoshoot.
3. Controleer de gegevens van de fotoshoot.
4. Bekijk of maak de factuur.
5. Pas de status van de fotoshoot en factuur aan wanneer dat nodig is.

### Hoe wijzig ik mijn wachtwoord?

1. Log in op de app.
2. Open **Mijn account**.
3. Vul je huidige en nieuwe wachtwoord in.
4. Sla de wijziging op.

---

## ℹ️ Voor wie is deze handleiding?

Deze uitleg is geschreven voor mensen zonder technische of programmeerkennis. Je hoeft geen code te begrijpen: volg gewoon de stappen in de aangegeven volgorde.
