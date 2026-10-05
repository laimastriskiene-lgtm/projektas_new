# Šeimos vizitai

## Projekto tikslas

„Šeimos vizitai“ – React + Vite aplikacija, skirta šeimos gydytojų vizitams planuoti ir sekti.

Pagrindinė idėja: vienoje vietoje matyti, **kada, kam ir pas kokį gydytoją** suplanuotas vizitas, o po vizito jį pažymėti kaip atliktą ir vėliau papildyti informacija.

---

## Technologijos

- React 19
- Vite 8
- JavaScript / JSX
- CSS
- React `useState` ir `useMemo`
- Google Fonts: Fraunces + Outfit

Projektas kuriamas **Cursor** aplinkoje.

---

## Paleidimas

Įdiegti priklausomybes:

```bash
npm install
```

Paleisti kūrimo režimą:

```bash
npm run dev
```

Sukurti produkcinę versiją:

```bash
npm run build
```

Paleisti produkcinės versijos peržiūrą:

```bash
npm run preview
```

Patikrinti kodą:

```bash
npm run lint
```

---

## Projekto struktūra

```text
MANO-APP
├── public
├── src
│   ├── assets
│   ├── components
│   │   ├── MembersPanel
│   │   ├── VisitForm
│   │   └── VisitProgress
│   ├── data
│   │   └── sampleData.js
│   ├── pages
│   │   ├── CalendarPage
│   │   └── LoginPage
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

---

## Pagrindiniai komponentai

### `App.jsx`

Pagrindinis aplikacijos komponentas.

Valdo:

- prisijungusį vartotoją;
- šeimos narius;
- vizitus;
- vizito sukūrimą;
- vizito ištrynimą;
- vizito pažymėjimą kaip atliktą;
- perėjimą tarp prisijungimo ir kalendoriaus.

---

### `LoginPage`

Prisijungimo puslapis.

Šiuo metu tai yra **prototipinis prisijungimas** – tikras vartotojo autentifikavimas dar neįgyvendintas.

Rodoma:

- aplikacijos pavadinimas;
- el. pašto laukelis;
- slaptažodžio laukelis;
- mygtukas „Prisijungti“;
- užregistruotų vizitų progreso kortelė.

---

### `CalendarPage`

Pagrindinis aplikacijos puslapis po prisijungimo.

Jame yra:

- kalendorius;
- mėnesio navigacija;
- vizitų žymėjimas kalendoriuje;
- pasirinktos dienos vizitų sąrašas;
- šeimos narių valdymas;
- naujo vizito pridėjimas;
- vizito ištrynimas;
- vizito pažymėjimas kaip atliktas;
- atsijungimas.

---

### `MembersPanel`

Skirtas šeimos nariams valdyti.

Galima:

- pridėti šeimos narį;
- neleisti įvesti tuščio vardo;
- neleisti pridėti tokio paties vardo;
- pašalinti šeimos narį.

Šeimos nario negalima pašalinti, jei jis turi susietų vizitų.

---

### `VisitForm`

Naujo vizito forma.

Vizitui nurodoma:

- data;
- laikas;
- šeimos narys;
- gydytojas.

---

### `VisitProgress`

Rodo užregistruotų vizitų skaičių.

Pavyzdys:

```text
Užregistruoti vizitai
3                         iš 10
███████████░░░░░░░░░░░░
```

Progreso reikšmė apskaičiuojama pagal vizitų skaičių.

---

## Vizito duomenų struktūra

Vizitas turi tokią struktūrą:

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

Galimos būsenos:

```text
planned
completed
```

### `planned`

Vizitas suplanuotas, bet dar neatliktas.

### `completed`

Vizitas atliktas.

---

## Šeimos nario duomenų struktūra

```js
{
  id: 'm1',
  name: 'Mama'
}
```

Pradiniai pavyzdiniai šeimos nariai:

- Mama
- Tėtis
- Emilija

---

## Dabartinis funkcionalumas

### Vizitų valdymas

- [x] Pridėti vizitą
- [x] Pasirinkti datą
- [x] Pasirinkti laiką
- [x] Pasirinkti šeimos narį
- [x] Įrašyti gydytoją
- [x] Ištrinti vizitą
- [x] Pažymėti suplanuotą vizitą kaip atliktą
- [x] Vizitą vizualiai atskirti pagal būseną
- [ ] Redaguoti atliktą vizitą
- [ ] Papildyti atliktą vizitą informacija

### Šeimos nariai

- [x] Pridėti šeimos narį
- [x] Pašalinti šeimos narį
- [x] Neleisti pašalinti nario, turinčio vizitų
- [x] Tikrinti pasikartojančius vardus

### Kalendorius

- [x] Rodyti einamąjį mėnesį
- [x] Pereiti į ankstesnį mėnesį
- [x] Pereiti į kitą mėnesį
- [x] Rodyti vizitų žymėjimą dienose
- [x] Atskirti suplanuotus ir atliktus vizitus

### Prisijungimas

- [x] Prisijungimo forma
- [x] Perėjimas į kalendorių
- [x] Atsijungimas
- [ ] Tikras vartotojo autentifikavimas

### Progreso kortelė

- [x] Rodyti užregistruotų vizitų skaičių
- [x] Rodyti progresą iki 10 vizitų
- [x] Rodyti progresą prisijungimo puslapyje

---

## MVP Acceptance Criteria

### Vizito sukūrimas

- Vartotojas gali sukurti vizitą.
- Vizitui privaloma nurodyti datą, laiką, šeimos narį ir gydytoją.
- Naujas vizitas sukuriamas su būsena `planned`.

### Vizito užbaigimas

- Suplanuotą vizitą galima pažymėti kaip atliktą.
- Atliktas vizitas vizualiai skiriasi nuo suplanuoto.
- Atlikto vizito būsena yra `completed`.

### Atlikto vizito redagavimas

Numatomas svarbus MVP funkcionalumas:

> **Atliktą vizitą galima bet kada vėliau atidaryti, redaguoti ir papildyti, išsaugant pakeitimus. Vizito būsena „Atliktas“ nuo to nepasikeičia.**

Tai reiškia, kad atliktas vizitas nėra užrakinamas.

Pavyzdžiui, galima vėliau papildyti:

- vizito informaciją;
- gydytojo komentarą;
- diagnozę;
- rekomendacijas;
- paskirtus vaistus;
- kitą svarbią informaciją.

---

## Duomenų saugojimas

Šiuo metu duomenys saugomi tik React aplikacijos būsenoje:

```js
useState()
```

Todėl perkrovus puslapį duomenys nėra patikimai išsaugomi.

Vėlesniam etapui numatoma pasirinkti nuolatinį duomenų saugojimą.

Galimos kryptys:

- `localStorage` – paprastas MVP variantas;
- Supabase;
- Firebase;
- kita duomenų bazė.

---

## Autentifikacija

Tikras autentifikavimas dar neįgyvendintas.

Dabartinis prisijungimas yra tik demonstracinis:

```js
onLogin({ email })
```

Slaptažodis šiuo metu nėra tikrinamas serveryje.

Vėlesniame etape reikės:

- vartotojo registracijos;
- tikro prisijungimo;
- slaptažodžio saugumo;
- vartotojo duomenų atskyrimo;
- atsijungimo mechanizmo.

---

## Dizaino sistema

Naudojami pagrindiniai spalvų kintamieji:

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

- `Fraunces` – antraštėms ir prekės ženklui;
- `Outfit` – pagrindiniam tekstui.

Bendras dizaino principas:

- šviesus fonas;
- žalios / mėlynai žalios spalvos akcentai;
- suapvalintos kortelės;
- paprasta ir rami medicininės aplikacijos estetika.

---

## Svarbios techninės taisyklės

1. Projektas yra **React + Vite**.
2. Nenaudoti nereikalingų bibliotekų, jei funkciją galima paprastai įgyvendinti React ir CSS.
3. Esamas dizainas turi būti išlaikomas, nebent sąmoningai prašoma jį keisti.
4. Naujos funkcijos turi būti suderinamos su esama MVP struktūra.
5. Lietuviškas vartotojo sąsajos tekstas turi būti nuoseklus.
6. Vizito būsena turi išlikti `completed`, net jei atliktas vizitas vėliau redaguojamas.
7. Keičiant vieną komponentą nereikėtų be reikalo perrašyti kitų komponentų.
8. Prieš didesnius pakeitimus verta patikrinti `npm run build`.

---

## Dabartinė projekto būsena

Šiuo metu pagrindinis MVP jau veikia.

Veikia:

- prisijungimo ekranas;
- progreso kortelė;
- šeimos narių valdymas;
- kalendorius;
- vizito sukūrimas;
- vizito ištrynimas;
- vizito užbaigimas;
- suplanuoto ir atlikto vizito vizualinis atskyrimas.

### Kitas pagrindinis darbas

**Įgyvendinti atlikto vizito atidarymą, redagavimą ir papildymą.**

Svarbiausia taisyklė:

```text
Atliktas → galima atidaryti → galima redaguoti → galima išsaugoti
                                      ↓
                              būsena lieka „Atliktas“
```

---

## Pavyzdiniai duomenys

`sampleData.js` generuoja pavyzdinius vizitus einamajam mėnesiui.

Pavyzdžiui:

```js
{
  id: 'v1',
  memberId: 'm1',
  date: 'einamo mėnesio 5 diena',
  time: '10:30',
  doctor: 'Dr. Petrauskienė',
  status: 'completed'
}
```

Taip pat yra du suplanuoti vizitai.

---

## Pastaba apie `VisitProgress`

`CalendarPage.jsx` šiuo metu importuoja:

```js
import VisitProgress from '../components/VisitProgress'
```

tačiau komponentas ten nenaudojamas.

Jeigu progreso kortelės kalendoriaus puslapyje nereikia, importą galima pašalinti:

```js
import VisitProgress from '../components/VisitProgress'
```

Pats `VisitProgress` komponentas naudojamas `LoginPage`, todėl jo ištrinti negalima.

---

## Ateities funkcijos

Galimos vėlesnės funkcijos:

1. Atlikto vizito redagavimas.
2. Vizito papildomos informacijos saugojimas.
3. `localStorage` arba duomenų bazė.
4. Tikras vartotojų autentifikavimas.
5. Vizitų paieška.
6. Vizitų filtravimas pagal šeimos narį.
7. Vizitų istorija.
8. Primintuvai apie artėjančius vizitus.
9. Gydytojų pasirinkimas iš sąrašo.
10. Vizito užrašų / rekomendacijų laukas.

---

## Projekto darbo principas

Kiekvieno darbo etapo pabaigoje verta atnaujinti:

```text
README.md
context.md
```

`README.md` skirtas projekto aprašymui ir naudojimui.

`context.md` skirtas projekto tęstinumui dirbant su AI ir kitais kūrimo etapais.

---

## AI kontekstas

Jeigu projektas tęsiamas su ChatGPT ar kitu AI asistentu, svarbiausia informacija:

```text
Projektas: Šeimos vizitai
Technologija: React + Vite
Kalba: JavaScript / JSX
Paskirtis: šeimos gydytojų vizitų planavimas ir sekimas.

Pagrindinis MVP:
- šeimos narių valdymas;
- vizitų kalendorius;
- vizito sukūrimas;
- vizito ištrynimas;
- vizito pažymėjimas kaip atlikto;
- atlikto ir suplanuoto vizito vizualinis atskyrimas;
- užregistruotų vizitų progreso kortelė.

Svarbiausia artimiausia funkcija:
Atliktą vizitą galima bet kada vėliau atidaryti,
redaguoti ir papildyti, išsaugant pakeitimus.
Vizito būsena „Atliktas“ nuo to nepasikeičia.

Duomenys šiuo metu laikomi React useState.
Tikras backend ir autentifikavimas dar neįgyvendinti.
```

---

## Projekto taisyklė ateities pakeitimams

Prieš keičiant kodą visada įvertinti:

- ar funkcija priklauso MVP;
- kuriam komponentui ji priklauso;
- ar reikia keisti duomenų struktūrą;
- ar reikia keisti `App.jsx` būseną;
- ar reikia keisti CSS;
- ar pakeitimas nesugadins jau veikiančių funkcijų.

Po pakeitimo rekomenduojama paleisti:

```bash
npm run build
```

ir patikrinti aplikaciją naršyklėje.

---

**Projekto pavadinimas:** Šeimos vizitai  
**Technologija:** React + Vite  
**README versija:** 2026-10-05
