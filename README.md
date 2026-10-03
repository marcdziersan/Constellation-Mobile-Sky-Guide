# CONSTELLATION Mobile — Feld-Sternkarte

Mobile-first, framework-freie HTML/CSS/JavaScript-Anwendung für die Beobachtung unterwegs.

## Enthalten

- **GPS-Standort** per Browser-Geolocation oder manuelle Koordinaten
- **Live-Uhrzeit** oder frei gewählter Beobachtungszeitpunkt
- **Horizontkarte** mit Nord/Ost/Süd/West, Höhe und Azimut
- **Gerätekompass / Peilmodus**: listet katalogisierte Objekte im Sichtkegel ±25°
- **32 gezeichnete Sternbilder** mit hellen Sternen und vereinfachten Figuren
- **Alle 12 Tierkreis-Sternbilder** plus **Ophiuchus** als astronomisch ekliptiknahes Sternbild
- **Vollständiger IAU-Nachschlagekatalog mit 88 Sternbildern**
- **Bedeutung, Mythologie und Beobachtungstipps** für die Tierkreiszeichen und wichtige Sternbilder
- **Sonne, Mond, Merkur, Venus, Mars, Jupiter, Saturn, Uranus und Neptun**
- Mondphase und Beleuchtungsanteil
- Laufbahn des gewählten Objekts über die nächsten Stunden
- Näherungsweise nächste Auf-/Untergangszeit und höchste Position
- Ekliptik, Raster, Sternnamen und Sternbildfiguren ein-/ausblendbar
- Suche, Filter und lokale Favoriten
- PWA-/Offline-Modus mit Service Worker
- Keine Frameworks, kein Build-Schritt, keine Server-API

## Start

Die Anwendung sollte über HTTP(S) laufen. Für lokale Entwicklung zum Beispiel:

```bash
python -m http.server 8080
```

Dann `http://localhost:8080` öffnen.

**GPS, Kompass-Sensorfreigaben und Service Worker benötigen auf echten Smartphones in der Regel HTTPS** (oder localhost in der Entwicklung).

## Genauigkeit

- Die gezeichneten Sterne verwenden feste, gerundete J2000-RA/Dec-Werte.
- Sonne, Mond und Planeten werden vollständig im Browser mit kompakten Niedrigpräzisions-Ephemeriden berechnet.
- Die Mondposition enthält die wichtigsten periodischen Korrekturen.
- Die Anwendung ist für visuelle Orientierung am Himmel gedacht, **nicht** für Navigation, Astrometrie, Okkultations-/Transit-Timing oder wissenschaftliche Messungen.
- „Sichtbar“ bedeutet zunächst **geometrisch über dem Horizont**. Tageslicht, Lichtverschmutzung, Wolken und lokale Hindernisse können ein Objekt trotzdem unsichtbar machen.

## Datenschutz

Die Anwendung sendet Standortdaten nicht an einen Server. Der zuletzt verwendete Standort und Favoriten werden ausschließlich in `localStorage` des Browsers abgelegt.

## Datenmodell

- `constellations.js` — 32 gezeichnete Sternbilder und helle Sterne
- `catalog88.js` — 88 offiziell anerkannte IAU-Sternbilder (Name, Kürzel, deutscher Name, Kategorie)
- `stories.js` — Bedeutung, Mythologie und Beobachtungstipps
- `ephemeris.js` — Sonne, Mond und Planeten
- `script.js` — Himmelsprojektion, GPS, Kompass, UI, Laufbahnen
- `style.css` — mobile-first Oberfläche

## Fachlicher Hinweis

Astronomische Sternbilder und astrologische Tierkreiszeichen sind nicht dasselbe. Die App kennzeichnet die zwölf klassischen Tierkreiszeichen ausdrücklich; Ophiuchus wird separat als Sternbild auf der Ekliptik erläutert.
