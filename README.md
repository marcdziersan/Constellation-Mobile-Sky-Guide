# Constellation Mobile Sky Guide

> Mobile Sternenkarte und Himmelsdatenbank mit GPS, Live-Himmelspositionen, Sternbildern, Tierkreis, Sonne, Mond und Planeten – entwickelt mit HTML, CSS und Vanilla JavaScript.

**Constellation Mobile Sky Guide** ist eine mobile Astronomie-Anwendung zur Erkundung des aktuellen Himmels anhand von Standort, Datum, Uhrzeit und – sofern vom Gerät unterstützt – der Blickrichtung des Smartphones.

Das Projekt verbindet eine interaktive Sternkarte mit astronomischen Berechnungen, GPS, Gerätesensoren und einem durchsuchbaren Sternbildkatalog. Die Anwendung ist bewusst leichtgewichtig aufgebaut und benötigt weder ein JavaScript-Framework noch eine externe Astronomie-API.

---

## Funktionen

- mobile, interaktive Sternkarte
- Standortbestimmung per GPS
- manuelle Eingabe von Breiten- und Längengrad
- aktuelle Uhrzeit und frei wählbarer Beobachtungszeitpunkt
- Gerätesensoren für Blickrichtung und Kompass
- Katalog aller 88 offiziellen IAU-Sternbilder
- alle 12 klassischen Tierkreis-Sternbilder
- Ophiuchus / Schlangenträger als zusätzliches astronomisches Ekliptik-Sternbild
- wichtige Sterne mit Namen und scheinbarer Helligkeit
- Position der Sonne
- Position und Phase des Mondes
- Positionen der Planeten
- Berechnung von Höhe und Azimut
- Anzeige der Himmelsrichtung
- Liste aktuell über dem Horizont befindlicher Objekte
- Laufbahnberechnung für die kommenden Stunden
- näherungsweise Auf- und Untergangszeiten
- Suche nach Sternbildern und Sternen
- Mythologie und Hintergrundinformationen
- Filter für Tierkreis und Sternbildgruppen
- Ekliptik-Anzeige
- Koordinatenraster
- Sternnamen und Sternbildlinien
- Zoom und Verschieben der Karte
- Favoriten
- Vollbildmodus
- responsive Smartphone-Oberfläche
- Progressive-Web-App-Unterstützung
- Offline-fähige Anwendungsoberfläche
- keine Benutzerkonten erforderlich
- keine externe Astronomie-API erforderlich
- kein Framework
- keine npm-Abhängigkeiten

---

## Idee des Projekts

Das Projekt begann als persönliche Beschäftigung mit Astronomie und der Frage:

> Kann ein Smartphone dabei helfen, unmittelbar zu erkennen, was ich gerade am Himmel sehe?

Aus einer klassischen Sternkarte entstand deshalb schrittweise eine mobile Anwendung, die mehrere Informationsquellen miteinander verbindet:

```text
Astronomie
    +
Standort
    +
Datum und Uhrzeit
    +
Gerätesensoren
    +
Datenvisualisierung
    =
mobiler Himmelsführer
```

Die Anwendung soll nicht nur zeigen, **wo ein Sternbild auf einer Karte liegt**, sondern möglichst praktisch beantworten:

- Welches Sternbild befindet sich gerade vor mir?
- Wo steht Cassiopeia?
- Ist Orion momentan über dem Horizont?
- In welcher Richtung finde ich Jupiter?
- Wie hoch steht der Mond?
- Welche Tierkreis-Sternbilder sind gerade sichtbar?
- Wann geht ein bestimmtes Objekt auf oder unter?
- Welche Objekte befinden sich in meiner aktuellen Blickrichtung?

---

## Mobile Beobachtung

Die Anwendung ist in erster Linie für Smartphones gedacht.

Über die Geolocation API kann der aktuelle Beobachtungsstandort ermittelt werden. Aus

- Breitengrad,
- Längengrad,
- Datum und
- Uhrzeit

wird anschließend berechnet, welche Himmelsobjekte sich am jeweiligen Standort über dem Horizont befinden.

Unterstützt das Gerät entsprechende Orientierungssensoren, kann zusätzlich die aktuelle Ausrichtung des Smartphones berücksichtigt werden.

Dadurch wird aus der Sternkarte ein einfacher Peilmodus.

Beispiel:

```text
Cassiopeia
Azimut: 24°
Höhe: 58°
Richtung: NNO
```

Dabei gilt:

**GPS** bestimmt, wo sich der Beobachter befindet.

**Datum und Uhrzeit** bestimmen, wie der Himmel relativ zum Beobachtungsort ausgerichtet ist.

**Der Gerätesensor** bestimmt, in welche Richtung das Smartphone zeigt.

---

## Sternbildkatalog

Der integrierte Katalog umfasst alle **88 offiziell von der Internationalen Astronomischen Union (IAU) definierten Sternbilder**.

Für ausgewählte Sternbilder sind zusätzlich detaillierte Sternkoordinaten und Verbindungslinien hinterlegt, sodass sie direkt auf der interaktiven Himmelskarte dargestellt werden können.

Zu den verfügbaren Informationen gehören je nach Sternbild unter anderem:

- lateinischer Name
- deutscher bzw. gebräuchlicher Name
- IAU-Kürzel
- wichtige Sterne
- Rektaszension
- Deklination
- scheinbare Helligkeit
- Zugehörigkeit zum Tierkreis
- Bedeutung
- Mythologie
- Beobachtungshinweise

Beispiele:

- Cassiopeia
- Großer Bär
- Kleiner Bär
- Orion
- Andromeda
- Perseus
- Schwan
- Leier
- Drache
- Pegasus
- Herkules
- Adler

---

## Tierkreis

Enthalten sind alle zwölf klassischen Tierkreis-Sternbilder:

- Widder – Aries
- Stier – Taurus
- Zwillinge – Gemini
- Krebs – Cancer
- Löwe – Leo
- Jungfrau – Virgo
- Waage – Libra
- Skorpion – Scorpius
- Schütze – Sagittarius
- Steinbock – Capricornus
- Wassermann – Aquarius
- Fische – Pisces

Zusätzlich berücksichtigt das Projekt den **Schlangenträger / Ophiuchus**.

Astronomisch verläuft die Ekliptik ebenfalls durch dieses Sternbild. Deshalb gehört Ophiuchus zur astronomischen Betrachtung der scheinbaren Sonnenbahn, auch wenn es nicht zu den klassischen zwölf astrologischen Tierkreiszeichen zählt.

Die Anwendung behandelt den Tierkreis astronomisch und dient nicht der Horoskop- oder Persönlichkeitsdeutung.

---

## Sonne, Mond und Planeten

Neben Sternen und Sternbildern berücksichtigt die Anwendung wichtige Objekte des Sonnensystems.

### Sonne

Berechnet werden unter anderem:

- aktuelle Position
- Höhe über dem Horizont
- Azimut
- ungefähre Laufbahn

### Mond

Beim Mond werden unter anderem dargestellt:

- aktuelle Position
- Höhe
- Azimut
- ungefähre Mondphase
- Beleuchtungsanteil

### Planeten

Unterstützt werden:

- Merkur
- Venus
- Mars
- Jupiter
- Saturn
- Uranus
- Neptun

Die astronomischen Berechnungen erfolgen lokal im Browser.

Eine externe Astronomie-API ist für die grundlegende Funktion nicht erforderlich.

---

## Astronomische Koordinaten

Das Projekt arbeitet unter anderem mit:

- Rektaszension
- Deklination
- Höhe
- Azimut

Rektaszension und Deklination beschreiben die Position eines Objekts auf der Himmelskugel.

Aus diesen Koordinaten sowie

- Beobachtungsort,
- Datum und
- Uhrzeit

wird die lokale Position des Objekts am Himmel berechnet.

Das Ergebnis wird anschließend in ein horizontales Koordinatensystem umgerechnet.

### Höhe

Die Höhe beschreibt, wie weit sich ein Objekt über dem Horizont befindet.

```text
0°  = Horizont
90° = Zenit
```

### Azimut

Der Azimut beschreibt die Richtung entlang des Horizonts.

Vereinfacht:

```text
0°   = Norden
90°  = Osten
180° = Süden
270° = Westen
```

---

## Laufbahn

Für ausgewählte Himmelsobjekte kann die Bewegung über mehrere Stunden betrachtet werden.

Die Anwendung kann dabei näherungsweise Informationen anzeigen wie:

- aktuelle Höhe
- zukünftige Position
- höchste Position
- nächsten Aufgang
- nächsten Untergang

Damit eignet sich die Anwendung nicht nur als Sternkarte, sondern auch als einfacher Beobachtungsplaner.

---

## Sichtbarkeit

Ein astronomisches Objekt kann rechnerisch über dem Horizont stehen, ohne mit bloßem Auge gut sichtbar zu sein.

Die Anwendung unterscheidet deshalb zwischen:

- geometrisch über dem Horizont
- Taghimmel
- Dämmerung
- dunklem Nachthimmel

Weitere reale Faktoren können die Beobachtung beeinflussen:

- Bewölkung
- Lichtverschmutzung
- Mondlicht
- atmosphärische Bedingungen
- Gebäude
- Bäume
- Gelände

Diese Faktoren werden derzeit nicht vollständig automatisch berücksichtigt.

---

## Technik

Das Projekt verwendet bewusst einen schlanken Web-Stack:

```text
HTML5
CSS3
Vanilla JavaScript
Canvas
SVG
Geolocation API
Device Orientation API
Progressive Web App APIs
LocalStorage
```

Es werden keine großen Frontend-Frameworks benötigt.

Insbesondere gibt es keine Abhängigkeit von:

```text
React
Vue
Angular
npm
```

Für die Anwendung ist kein Build-Prozess erforderlich.

---

## Datenschutz

Für die Verwendung der Sternkarte ist kein Benutzerkonto notwendig.

Standortdaten werden für die astronomische Berechnung des lokalen Himmels verwendet.

Die grundlegenden Berechnungen erfolgen direkt im Browser.

Eine Übertragung der GPS-Koordinaten an eine externe Astronomie-API ist nicht erforderlich.

Alternativ kann der Standort manuell über Breiten- und Längengrad angegeben werden.

---

## Progressive Web App

Constellation Mobile Sky Guide kann als Progressive Web App betrieben werden.

Auf unterstützten Geräten kann die Anwendung dadurch auf dem Startbildschirm installiert und ähnlich wie eine normale App gestartet werden.

Der Anwendungskern kann für die Offline-Nutzung zwischengespeichert werden.

Da die grundlegenden astronomischen Berechnungen lokal erfolgen, bleiben viele Funktionen auch ohne permanente Serververbindung nutzbar.

---

## Voraussetzungen

Für die vollständige mobile Funktion sollte die Anwendung über **HTTPS** bereitgestellt werden.

Moderne Browser erlauben Funktionen wie

- GPS,
- Gerätesensoren und
- Service Worker

aus Sicherheitsgründen in der Regel nur in sicheren Browser-Kontexten.

Für lokale Entwicklung ist `localhost` üblicherweise ebenfalls zulässig.

---

## Genauigkeit

Die Sternbild- und Sternpositionen basieren auf astronomischen Koordinaten.

Berechnungen von

- Sonne,
- Mond,
- Planeten,
- Aufgang,
- Untergang und
- Laufbahnen

sind für allgemeine Beobachtung, Orientierung und Lernzwecke gedacht.

Das Projekt ersetzt keine professionelle astronomische Ephemeriden-Software.

Auch die Genauigkeit des Smartphone-Kompasses kann variieren.

Einflussfaktoren sind beispielsweise:

- Qualität der Gerätesensoren
- Kalibrierung
- magnetische Störungen
- Smartphone-Hülle
- Umgebung
- Browser
- Betriebssystem

---

## Projektstatus

**Experimentell / in aktiver Entwicklung**

Das Projekt ist ein persönliches Astronomie- und Entwicklungsprojekt.

Es verbindet fachliches Interesse an Astronomie und Orientierung mit praktischer Webentwicklung, Datenverarbeitung und mobilen Geräteschnittstellen.

---

## Geplante Erweiterungen

Mögliche nächste Schritte:

- vollständige detaillierte Sterndaten für alle 88 Sternbilder
- größerer Sternkatalog
- Messier-Objekte
- NGC-Objekte
- Sternhaufen
- Nebel
- Galaxien
- Meteorströme
- Beobachtungskalender
- Internationale Raumstation
- Satelliten
- Beobachtungsfavoriten
- persönliches Beobachtungslogbuch
- Nachtmodus mit roter Darstellung
- Kamera-/AR-Modus
- bessere Kompasskalibrierung
- Wetterdaten
- Bewölkungsinformationen
- Lichtverschmutzungskarte
- verbesserte Planeten-Ephemeriden
- Deep-Sky-Beobachtungsplaner
- genauere Auf- und Untergangsberechnung

---

## Verzeichnisstruktur

Je nach Projektstand kann die Anwendung beispielsweise so aufgebaut sein:

```text
/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
└── README.md
```

---

## Installation

Das Repository kann direkt auf einen normalen Webserver kopiert werden.

Ein klassischer Build-Prozess ist nicht erforderlich.

Für lokale Tests kann ein einfacher HTTP-Server verwendet werden.

Für die GPS-, Sensor- und PWA-Funktionen sollte die produktive Version über HTTPS erreichbar sein.

---

## Motivation

Constellation Mobile Sky Guide ist kein klassisches Business-Projekt.

Es entstand aus persönlichem Interesse an

- Astronomie,
- Sternbildern,
- Navigation,
- GPS,
- Orientierung und
- der Frage, wie sich reale Daten auf einem Smartphone sinnvoll visualisieren lassen.

Das Projekt dient deshalb gleichzeitig als praktische Anwendung und als Experimentierfeld für astronomische Berechnungen, mobile Browser-Schnittstellen und interaktive Datenvisualisierung.

---

## Autor

**Marcus Dziersan**

Anwendungsentwicklung · Webentwicklung · experimentelle Tools · selbst gehostete Projekte

GitHub: `marcdziersan`

---

## Lizenz

MIT

---

> Entstanden aus der Neugier darauf, was über uns zu sehen ist – und ob ein Smartphone dabei helfen kann, es zu finden.
