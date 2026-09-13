## Wie das Ganze aufgebaut ist

Alles Sichtbare steckt im `app`-Ordner, weil Next.js daraus automatisch die Seiten baut. `app/layout.tsx` ist der Rahmen um jede Seite: dort wird das globale CSS (`app/global.css`) geladen und die TopBar (`app/components/topbar.tsx`) sowie der Footer eingebaut. Die Startseite selbst ist einfach `app/page.tsx` mit dem Hero-Bereich.

Login, Registrieren, Passwort vergessen und Passwort zurücksetzen haben je eine eigene Seite (`app/login`, `app/register`, `app/forgot-password`, `app/reset-password`). Was beim Klick auf "Anmelden" wirklich passiert, steht aber nicht in den Seiten selbst, sondern gesammelt in `app/auth/actions.ts` – dort sind `login`, `register`, `requestPasswordReset` und `logout`. Beim Passwort-Reset gibt es zusätzlich `reset-password-form.tsx`, weil dort im Browser geprüft werden muss, ob der Link aus der Mail noch gültig ist.

Fürs eigene Konto gibt's `app/account` (inkl. `actions.ts` zum Speichern von Telefonnummer/Instagram), für die Profile von anderen `app/profile/[id]` – nur zum Ansehen.

Der eigentliche Kern ist natürlich alles rund um die Videos, unter `app/videos`:

- `videos/page.tsx` – die Übersicht als Karten-Raster
- `videos/video-thumbnail.tsx` – kümmert sich nur um das Vorschaubild einer Karte und zeigt ein Platzhalter-Icon, wenn das Bild mal nicht lädt
- `videos/[id]/page.tsx` – die Detailseite mit Player, Beschreibung und Tipps
- `videos/[id]/video-player.tsx` – der Player selbst; der Ton ist fest stummgeschaltet und lässt sich auch über die Steuerung nicht mehr einschalten
- `upload/page.tsx` + `upload-form.tsx` – das Formular zum Hochladen eines neuen Videos
- `videos/[id]/edit/page.tsx`, `delete-video-button.tsx` und `videos/actions.ts` (`updateVideo`, `deleteVideo`) – zum Bearbeiten und Löschen eigener Videos, inklusive Aufräumen der Dateien im Speicher

Die ganze Supabase-Anbindung liegt in `lib/supabase`. `config.ts` liest die Umgebungsvariablen, `client.ts` und `server.ts` bauen jeweils einen Supabase-Client für Browser bzw. Server, und `admin.ts` einen mit vollen Rechten, z. B. um signierte Video-URLs zu erzeugen. `middleware.ts` hält die Login-Session frisch – aufgerufen wird sie aber über `proxy.ts` im Hauptordner, weil diese Next.js-Version dafür `proxy.ts` statt der klassischen `middleware.ts` verwendet.

Und dann gibt's noch `lib/instagram.ts`, ein kleiner Helfer, der aus einem Instagram-Namen einen fertigen Profil-Link baut.


## Roadmap

Geplante Verbesserungen und Features, priorisiert nach Nutzen für den Verein.

### Zugriff & Rollen
- [ ] Login-System mit Rollen (Trainer / Admin / Mitglied) – regelt, wer Videos nur ansehen und wer zusätzlich hochladen darf

### Sicherheit
- [ ] Sicherheitshinweis bei anspruchsvollen Übungen (z. B. Backflip): Hinweis auf nötige Aufsicht und passenden Trainingsstand

### Video-Struktur
- [ ] Jedem Video ein Gerät zuweisen (Boden, Ringe, Reck, Barren, Sprung, ...)
- [ ] Jedem Video einen Schwierigkeitsgrad zuweisen (Anfänger / Fortgeschritten / Profi)
- [ ] Echtes Thumbnail pro Video/Übung (kein Platzhalterbild)
- [ ] Detailseiten strukturieren: Schwierigkeit, Gerät, Voraussetzungen, häufige Fehler und Sicherheitshinweise als klare Felder statt Fliesstext

### Suche & Filter
- [ ] Suche nach Titel/Übungsname
- [ ] Filter nach Gerät und Schwierigkeit
- [ ] Videokarten erweitern: Gerät, Level und Dauer direkt sichtbar machen

### Startseite
- [ ] Startseite füllen: "Neue Videos", "Beliebte Übungen", Fotos und ein einleitender Text über die Website

### Persönlicher Fortschritt
- [ ] Favoriten-Funktion ("Merken") und eigener Bereich "Meine Übungen"
- [ ] Fortschrittsstatus pro Übung (Nicht gelernt → In Arbeit → Kann ich)

### Team & Synchronturnen
- [ ] Fortschrittsstatus mit anderen teilen können
- [ ] Vergleich, welche Teile eine Gruppe bereits gemeinsam beherrscht (für Synchronturnen)



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
