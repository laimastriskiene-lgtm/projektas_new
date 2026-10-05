# Šeimos vizitai — projekto kontekstas

> Šis failas skirtas tęsti projektą kituose pokalbiuose. Prieš keičiant kodą pirmiausia perskaityti šį `context.md`.
>
> Paskutinis atnaujinimas: 2026-10-05

## 1. Projekto tikslas

**Šeimos vizitai** – React + Vite MVP šeimos gydytojų vizitams planuoti ir sekti.

Pagrindinė idėja: šeimos narys, atsakingas už šeimos vizitus, kalendoriuje gali matyti, kada, kam ir pas kokį gydytoją reikia vykti.

## 2. Dabartinis statusas

### Įgyvendinta
- Prisijungimo puslapio prototipas.
- Šeimos narių pridėjimas ir pašalinimas.
- Apsauga nuo nario pašalinimo, jei jis turi vizitų.
- Vizito pridėjimas, trynimas ir rodymas kalendoriuje.
- Mėnesio navigacija ir dienos pasirinkimas.
- Vizito pažymėjimas „Atliktas“.
- Skirtingas suplanuoto ir atlikto vizito vaizdavimas.
- „Užregistruoti vizitai“ progreso kortelė prisijungimo puslapyje.
- Dabartinis pavyzdinis rodmuo: **3 iš 10**.

### Dar neįgyvendinta
Svarbiausia būsima MVP funkcija:
- atliktą vizitą atidaryti;
- redaguoti;
- papildyti informacija apie vizitą;
- išsaugoti pakeitimus;
- išlaikyti būseną **„Atliktas“**.

## 3. Technologijos

- React `19.2.8`
- React DOM `19.2.8`
- Vite `8.3.0`
- JavaScript / ES Modules
- CSS
- ESLint `10.10.0`
- `@vitejs/plugin-react` `6.1.1`

`package.json` skriptai:
```text
npm run dev
npm run build
npm run lint
npm run preview
```

Projekte nėra UI bibliotekos.

## 4. Darbo aplinka

Projektas kuriamas naudojant **Cursor**.

Pageidautina:
- pateikti aiškų, kopijuoti/įklijuoti paruoštą kodą;
- nenaudoti sprendimų, kuriems būtini Cursor AI kreditai;
- keičiant kodą aiškiai nurodyti failą ir vietą.

## 5. Projekto struktūra

```text
MANO-APP
├── node_modules
├── public
├── src
│   ├── assets
│   ├── components
│   │   ├── MembersPanel
│   │   │   ├── MembersPanel.jsx
│   │   │   └── MembersPanel.css
│   │   ├── VisitForm
│   │   │   ├── VisitForm.jsx
│   │   │   └── VisitForm.css
│   │   └── VisitProgress
│   │       ├── VisitProgress.jsx
│   │       └── VisitProgress.css
│   ├── data
│   │   └── sampleData.js
│   ├── pages
│   │   ├── CalendarPage
│   │   │   ├── CalendarPage.jsx
│   │   │   └── CalendarPage.css
│   │   └── LoginPage
│   │       ├── LoginPage.jsx
│   │       └── LoginPage.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── ...
```

## 6. Programos srautas

`main.jsx` paleidžia:
```jsx
<StrictMode>
  <App />
</StrictMode>
```

`App.jsx` valdo:
- `user`
- `members`
- `visits`

Neprisijungus:
```jsx
<LoginPage onLogin={setUser} visits={visits} />
```

Prisijungus rodomas `CalendarPage`.

## 7. App.jsx logika

### `handleAddMember(name)`
Prideda:
```js
{ id: createMemberId(), name }
```

### `handleDeleteMember(memberId)`
Jei narys turi vizitų, rodomas:
```text
Negalima pašalinti: šis narys turi vizitų. Pirmiau ištrinkite vizitus.
```

### `handleAddVisit({ date, time, memberId, doctor })`
Sukuria:
```js
{
  id: createVisitId(),
  date,
  time,
  memberId,
  doctor,
  status: 'planned'
}
```

### `handleDeleteVisit(visitId)`
Pašalina vizitą.

### `handleCompleteVisit(visitId)`
Pakeičia:
```text
planned → completed
```

## 8. Duomenų modelis

### Family member
```js
{
  id: 'm1',
  name: 'Mama'
}
```

### Visit
```js
{
  id: 'v1',
  memberId: 'm1',
  date: '2026-10-05',
  time: '10:30',
  doctor: 'Dr. Petrauskienė',
  status: 'completed'
}
```

Būsenos:
```text
planned   → Suplanuotas
completed → Atliktas
```

Ateityje gali būti papildomi laukai, pvz.:
```js
{
  ...,
  notes: '',
  result: '',
  recommendations: ''
}
```
Tikslūs laukai dar nepatvirtinti.

## 9. sampleData.js

Pradiniai šeimos nariai:
```text
Mama
Tėtis
Emilija
```

Pavyzdiniai vizitai:
- `v1`: Mama, 10:30, Dr. Petrauskienė, `completed`
- `v2`: Emilija, 14:00, Dr. Kazlauskas, `planned`
- `v3`: Tėtis, 09:15, Dr. Jankauskaitė, `planned`

Datos automatiškai pritaikomos einamajam mėnesiui.

## 10. CalendarPage

Pagrindiniame puslapyje yra:
- programos pavadinimas;
- vartotojo el. paštas;
- „+ Pridėti vizitą“;
- „Atsijungti“;
- kalendorius;
- mėnesio navigacija;
- šeimos narių skiltis;
- pasirinktos dienos vizitų sąrašas;
- naujo vizito forma.

Savaitės dienos:
```text
Pr An Tr Kt Pn Št Sk
```

Kalendoriuje:
- `planned` rodomas `var(--planned)` tašku;
- `completed` rodomas `var(--completed)` tašku.

Vizito kortelėje rodoma:
- laikas;
- šeimos narys;
- būsena;
- gydytojas;
- veiksmai.

Suplanuotam rodomas „Pažymėti atliktu“, o trynimui naudojamas patvirtinimas:
```text
Ar tikrai ištrinti šį vizitą?
```

## 11. VisitForm

Naujo vizito forma turi:
- Datą;
- Laiką;
- Šeimos narį;
- Gydytoją.

Visi laukai privalomi.

Jei šeimos narių nėra:
```text
Pirmiau pridėk bent vieną šeimos narį skiltyje „Šeimos nariai“.
```

Mygtukai:
```text
Atšaukti
Išsaugoti
```

Gydytojo tekstas prieš išsaugojimą apkarpomas su `trim()`.

## 12. MembersPanel

Leidžia:
- pridėti šeimos narį;
- pašalinti šeimos narį.

Negalima:
- pridėti tuščio vardo;
- pridėti tokio paties vardo.

Palyginimas ignoruoja didžiąsias / mažąsias raides, todėl `Mama`, `mama` ir `MAMA` laikomi tuo pačiu vardu.

## 13. VisitProgress

Komponentas rodo:
```text
Užregistruoti vizitai
3
iš 10
```

Numatytoji riba:
```js
maxVisits = 10
```

Skaičius:
```js
visits.length
```

Progresas:
```js
Math.min((visitCount / maxVisits) * 100, 100)
```

Naudojami ARIA atributai:
```text
role="progressbar"
aria-valuenow
aria-valuemin
aria-valuemax
aria-label
```

## 14. LoginPage

Prisijungimo puslapyje yra:
- el. paštas;
- slaptažodis;
- „Prisijungti“;
- „Užregistruoti vizitai“ progreso kortelė.

Dabartinis prisijungimas yra tik prototipas. `handleSubmit` perduoda:
```js
onLogin({ email })
```

Slaptažodis nėra tikrinamas ir nesaugomas.

## 15. Duomenų saugojimas

Šiuo metu naudojamas React `useState`.

Todėl:
- duomenys saugomi tik programos veikimo metu;
- perkrovus puslapį būsena prarandama;
- vėl užkraunami pavyzdiniai duomenys.

Dar nepasirinkta, ar ateityje naudoti:
- LocalStorage;
- Firebase;
- Supabase;
- kitą backend.

## 16. Autentifikacija

Tikra autentifikacija neįgyvendinta.

Dabartinis modelis:
```js
const [user, setUser] = useState(null)
```

Prisijungimas:
```js
setUser({ email })
```

Atsijungimas:
```js
setUser(null)
```

## 17. Dizaino sistema

```css
--text: #5a635f;
--text-h: #1c2a26;
--bg: #f3f6f4;
--border: #d5ddd8;
--accent: #2a6f6f;
--accent-hover: #235c5c;
--accent-soft: rgba(42, 111, 111, 0.12);
--planned: #c4955a;
--completed: #2e7d5a;
```

Šriftai:
- antraštėms: **Fraunces**
- pagrindiniam tekstui: **Outfit**

## 18. Responsive dizainas

Naudojama:
```css
@media (max-width: 640px)
```

Mobiliajame variante mažinami tarpai ir kalendoriaus elementai, o vizito kortelės gali persikelti į kelias eilutes.

## 19. Svarbus būsimas funkcionalumas

### Atlikto vizito redagavimas

Pageidaujamas srautas:
```text
Atidaryti atliktą vizitą
        ↓
Peržiūrėti informaciją
        ↓
Redaguoti
        ↓
Papildyti informaciją
        ↓
Išsaugoti
        ↓
Būsena lieka „Atliktas“
```

### Acceptance Criteria

- [x] Atliktas vizitas vizualiai skiriasi nuo suplanuoto.
- [ ] Atliktą vizitą galima atidaryti.
- [ ] Atliktą vizitą galima redaguoti.
- [ ] Atliktą vizitą galima papildyti.
- [ ] Pakeitimus galima išsaugoti.
- [ ] Po redagavimo būsena išlieka `completed`.
- [ ] Redagavimas nepaverčia `completed` į `planned`.

## 20. Bendra MVP Acceptance Criteria

### Šeimos nariai
- [x] Pridėti narį.
- [x] Neleisti tuščio vardo.
- [x] Neleisti pasikartojančio vardo.
- [x] Pašalinti narį, jei jis neturi vizitų.
- [x] Neleisti pašalinti nario, turinčio vizitų.

### Vizitai
- [x] Sukurti vizitą.
- [x] Nurodyti datą.
- [x] Nurodyti laiką.
- [x] Priskirti šeimos narį.
- [x] Nurodyti gydytoją.
- [x] Naujas vizitas tampa `planned`.
- [x] Rodyti kalendoriuje.
- [x] Ištrinti.
- [x] Pažymėti atliktu.
- [x] Vizualiai atskirti būsenas.
- [ ] Atidaryti atliktą vizitą.
- [ ] Redaguoti atliktą vizitą.
- [ ] Papildyti atliktą vizitą.
- [ ] Išsaugoti pakeitimus.
- [ ] Išlaikyti `completed`.

### Prisijungimas
- [x] Prisijungimo forma.
- [x] Privalomas el. paštas.
- [x] Privalomas slaptažodis.
- [x] Prisijungus rodomas CalendarPage.
- [x] Atsijungimas.
- [ ] Tikra autentifikacija.

### Progreso kortelė
- [x] Vizitų skaičius.
- [x] Skaičius iš 10.
- [x] Progreso juosta.
- [x] Maksimumas 100 %.
- [x] Rodoma prisijungimo puslapyje.

## 21. Techninė pastaba

`CalendarPage.jsx` turi importą:
```js
import VisitProgress from '../components/VisitProgress'
```
bet šiame puslapyje komponentas nenaudojamas.

Tai nėra kritinė MVP problema. Ateityje:
- pašalinti nereikalingą importą arba
- panaudoti komponentą, jei jis bus reikalingas.

## 22. Darbo principai keičiant projektą

1. Negriauti veikiančių MVP funkcijų.
2. Prieš keičiant failą patikrinti jo dabartinę versiją.
3. Aiškiai nurodyti keičiamą failą.
4. Jei keičiamas visas failas – pateikti pilną failo kodą.
5. Jei keičiamas fragmentas – nurodyti, kur jį įdėti.
6. Naujas bibliotekas diegti tik aptarus.
7. Išlaikyti lietuvišką vartotojo sąsają.
8. Išlaikyti esamą spalvų ir šriftų sistemą.
9. Tikros autentifikacijos ar duomenų bazės nediegti be aptarimo.
10. Prieš didesnius pakeitimus trumpai paaiškinti, ką jie duos naudotojui.

## 23. Prioritetinis tolesnis darbas

### 1. Atlikto vizito redagavimas
Sukurti atlikto vizito atidarymo, redagavimo, papildymo ir išsaugojimo funkciją.

### 2. Vizito papildomos informacijos laukai
Aptarti, kokius laukus saugoti po vizito, pvz.:
- rezultatas;
- pastabos;
- gydytojo rekomendacijos;
- vaistai;
- kitas vizitas.

Šie laukai dar nepatvirtinti.

### 3. Duomenų išsaugojimas
Aptarti LocalStorage arba backend.

### 4. Tikra autentifikacija
Tik vėliau spręsti dėl tikro email + password prisijungimo.

## 24. Ko nekeisti be aptarimo

Nekeisti be vartotojos sprendimo:
- pagrindinių spalvų;
- šriftų;
- projekto paskirties;
- vizito būsenų;
- lietuviškų UI tekstų;
- duomenų saugojimo technologijos;
- autentifikacijos technologijos;
- projekto struktūros dideliu mastu.

## 25. Paskutinė žinoma būsena

**Data: 2026-10-05**

Projektas veikia kaip React + Vite MVP.

Sėkmingai įgyvendinta užregistruotų vizitų progreso kortelė prisijungimo puslapyje.

Dabartinis pavyzdinis rodmuo:
```text
Užregistruoti vizitai
3 iš 10
```

Pagrindinis kitas funkcionalumas:
> **Atlikto vizito atidarymas, redagavimas ir papildymas, išlaikant būseną „Atliktas“.**

## 26. Šio failo naudojimas

Po kiekvieno didesnio projekto pakeitimo atnaujinti:
- projekto būseną;
- įgyvendintas funkcijas;
- neįgyvendintas funkcijas;
- žinomas problemas;
- Acceptance Criteria;
- paskutinio pakeitimo datą;
- kitą rekomenduojamą žingsnį.

Kitame pokalbyje galima parašyti:
> „Tęsiame Šeimos vizitų projektą. Perskaityk context.md.“

Tada šis failas turi būti pagrindinis projekto kontekstas.
