# SwiftCare — Nepal Ambulance & Emergency Response

An Expo / React Native app that puts Nepal's emergency numbers and a province-by-province
ambulance directory on your phone, with one-tap calling and road routing through Google Maps.

## Features

- **One-tap calling** — the national ambulance code `102`, police `100`, fire `101`, traffic `103`
  and every published provider number open straight in the dialer.
- **Nepal-wide ambulance directory** — 80+ publicly published ambulance and hospital contacts
  across Bagmati, Koshi, Madhesh, Gandaki and Lumbini, grouped by province, with search and
  filters.
- **Helplines tab** — national emergency short codes plus the police control room of all
  seven provinces.
- **Road routing & maps** — pick a starting point and a destination, choose the travel mode, and
  open the real road route (with live roads and traffic) in Google Maps. No map key required.
- **Offline friendly** — the whole directory ships inside the app, so numbers are available
  without mobile data.
- **Beautiful, responsive UI** — a single design-token theme keeps every screen consistent.

## Project structure

| File | Purpose |
| --- | --- |
| [App.tsx](App.tsx) | App shell: header, tab bar and screen switching. |
| [theme.ts](theme.ts) | Colours, radii, spacing and shadows used everywhere. |
| [ambulanceDirectory.ts](ambulanceDirectory.ts) | All directory data: national short codes, province police offices and provider listings, each with its public source. |
| [lib/links.ts](lib/links.ts) | Dialer and Google Maps deep-link helpers. |
| [lib/tabs.ts](lib/tabs.ts) | Tab definitions. |
| [components/ui.tsx](components/ui.tsx) | Reusable UI pieces (Icon, Chip, SectionHeader, CallButton, NoticeCard…). |
| [components/AmbulanceCard.tsx](components/AmbulanceCard.tsx) | A single provider card. |
| [screens/](screens) | Home, Directory, Routes and Profile screens. |

## Run it

```bash
npm install
npm start          # then press a / i / w for Android, iOS or web
npm run typecheck  # TypeScript check
```

## Data & coverage

Every number is read from a public source page, and each entry links back to that page so it can
be re-checked. Numbers change, so the app never promises that a line will answer — please confirm
availability and the service area when you call.

Every district of Nepal is covered. Each of the **77 districts** has a Nepal Red Cross Society
district chapter line — a real, published ambulance / disaster number that covers the rural
municipalities and villages inside it — so all seven provinces, including **Karnali** and
**Sudurpashchim**, are represented. On top of that, the larger cities, nagarpalika (municipality)
lines and hospital / community ambulance services that were individually published are listed.

Individual wards and villages rarely publish their own ambulance number. Where one is not
published, the entry is tagged by level (`District chapter`, `Municipality`, `Metropolitan city`)
so you know exactly what a number covers; otherwise call the district chapter or the national
`102`. Two districts (Eastern Rukum and Western Rukum) publish no NRCS chapter line, so they are
left out rather than guessed.

### Public sources

- [Nepal Ambulance Service](https://nepalambulanceservice.org/contact) — national ambulance provider, `102`.
- [Nagarik Alert — Ambulance Services directory](https://nagarikalert.com/content/ambulance) — province-level provider listings.
- [ICE Nepal — Emergency help in Nepal](https://icenepal.com/emergency) — national desks, helplines and the seven province police offices.
- [News of Nepal — Important Numbers](https://newsofnepal.com/important-numbers/) — Kathmandu Valley ambulance and hospital lines.
- [Nepal Red Cross Society](https://nrcs.org/our-presence/) and [The Rising Nepal](https://www.risingnepaldaily.com/news/88148) — NRCS ambulance and toll-free `1130`.
- [Nepalnews](https://english.nepalnews.com/s/nation/disaster-hotline-1234-extended-to-all-districts-to-enhance-rescue-operations/) — disaster hotline `1234`.
- [Lalitpur Metropolitan City, Ward 28](https://ward28.lmc.gov.np/page/emergency-service) and [Patan Academy of Health Sciences](https://web.pahs.edu.np/) — municipal and hospital ambulance lines.

SwiftCare is an independent, offline directory. It is not an official dispatch service.
