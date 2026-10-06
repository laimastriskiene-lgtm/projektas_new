# Šeimos vizitai — projekto kontekstas

Šis failas skirtas darbą tęsti kitame pokalbyje ar su kitu AI įrankiu. Prieš keičiant kodą perskaityk `AGENTS.md` ir šį failą. Jei aprašas nesutampa su kodu, pirmenybę teik dabartiniam kodui.

Atnaujinta: 2026-10-06

## Projekto paskirtis

„Šeimos vizitai“ — React + Vite programėlė šeimos narių vizitams pas gydytojus planuoti ir sekti. Naudotojas gali pasirinkti dieną, įrašyti vizito laiką, šeimos narį ir gydytoją, o vėliau vizitą pažymėti atliktu ir papildyti jo informacija.

Sąsajos kalba — lietuvių. Išlaikyk dabartinę šviesią pilkšvai žalsvą temą, žalsvai mėlyną akcentą, žalią atlikto vizito spalvą, šriftus ir apvalintų kortelių stilių.

## Technologijos ir apribojimai

- React 19, React DOM, Vite, JavaScript/JSX ir paprasti CSS failai.
- Komponentai laikomi `src/`, jų stiliai — atskiruose `.css` failuose.
- Nenaudoti TypeScript, Tailwind, CSS Modules ar naujų bibliotekų, nebent to aiškiai paprašyta.
- Dabartinė duomenų būsena laikoma React `useState`. Nenaudoti backend, LocalStorage, Firebase ar Supabase, nebent to aiškiai paprašyta.
- Prisijungimas yra vietaženklis; tikros autentifikacijos nėra.
- Prieš redaguojant failą jį perskaityti. Saugoti esamas MVP funkcijas ir nekeisti nesusijusio kodo.

## Faktinė projekto struktūra

Komponentai laikomi tiesiogiai savo kataloguose; `CalendarPage/` ar `VisitForm/` poaplankių nėra.

```text
src/
  App.jsx
  App.css
  index.css
  main.jsx
  data/
    sampleData.js
    sampleDoctors.js
  components/
    MembersPanel.jsx
    MembersPanel.css
    VisitForm.jsx
    VisitForm.css
    VisitProgress.jsx
    VisitProgress.css
    CompletedVisitDialog.jsx
    CompletedVisitDialog.css
    VisitReminder.jsx
    VisitReminder.css
  pages/
    CalendarPage.jsx
    CalendarPage.css
    DoctorCatalogPage.jsx
    DoctorCatalogPage.css
    LoginPage.jsx
    LoginPage.css
```

## Veikiantis pagrindinis srautas

- Neprisijungus rodoma `LoginPage`; bet koks galiojantis el. pašto ir slaptažodžio įvedimas veikia kaip demonstracinis prisijungimas.
- Prisijungus rodoma `CalendarPage` su mėnesio kalendoriumi, pasirinktos dienos vizitų skydeliu virš kalendoriaus, šeimos narių skiltimi ir veiksmų mygtukais.
- Kalendoriuje suplanuoti (`planned`) ir atlikti (`completed`) vizitai žymimi skirtingų spalvų taškais.
- Galima pridėti vizitą, pasirinkti šeimos narį, pažymėti vizitą atliktu, ištrinti vizitą su patvirtinimu, pridėti šeimos narį ir pašalinti narį, jei jis neturi vizitų.
- Priminimai naudoja naršyklės Notification API, jei naudotojas suteikė leidimą.
- Atsijungimas grąžina į prisijungimo puslapį.
- Pradiniai šeimos nariai: Mama, Tėtis, Emilija. `src/data/sampleData.js` sukuria tris pavyzdinius einamojo mėnesio vizitus.
- Kalendoriaus puslapyje yra vizitų paieškos ir filtravimo skiltis: šeimos narys, gydytojo vardas/pavardė, konkreti data ir būsena.
- Kalendoriaus viršuje rodoma vizuali rytojaus suplanuotų vizitų kortelė, kai tokių vizitų yra.
- Kalendoriaus navigacijos mygtukas „Gydytojų katalogas“ atidaro gydytojų katalogo puslapį; katalogo viršuje esanti nuoroda grąžina į kalendorių.

## Gydytojų katalogas

- `src/data/sampleDoctors.js` turi demonstracinius gydytojų įrašus: vardą, specialybę, miestą, Pincetas.lt rekomendacijų procentą, reitingo patikrinimo datą ir profilio nuorodą.
- Reitingai yra patikrinimo dienos statinė momentinė kopija; jie gali keistis Pincetas.lt.
- `App.jsx` valdo `currentPage` (`calendar` arba `doctors`) per React `useState`; navigacija nepakeičia vizitų ar šeimos narių būsenų.
- `DoctorCatalogPage` rodo katalogo korteles, leidžia filtruoti pagal vardą, specialybę ir miestą, o Pincetas.lt nuorodos atidaromos naujame skirtuke.
- Puslapių ir komponentų failai laikomi tiesiai `src/pages/` ir `src/components/` aplankuose, pagal dabartinę projekto struktūrą.

## Vizualus rytojaus vizitų priminimas

`src/components/VisitReminder.jsx` gauna `visits` ir `members` per props. Pagal kompiuterio vietinę datą apskaičiuoja rytojų, atrenka tik `status === 'planned'` ir `date === rytojaus data` vizitus, tada surikiuoja juos pagal `time`. `time` nenaudojamas datos palyginimui. Kortelė paslepiama, kai rytojaus vizitų nėra; vienam vizitui rodo „Rytoj vizitas“, keliems — „Rytoj vizitai“. Kiekvienoje eilutėje rodomas šeimos narys, gydytojas ir laikas.

Ši nauja kortelė yra tik programėlės viduje ir pati nenaudoja el. laiškų, SMS ar naršyklės pranešimų API. Anksčiau buvęs atskiras vizito priminimo nustatymas lieka nepakeistas.

## Vizitų paieška ir filtravimas

`src/pages/CalendarPage.jsx` filtrų reikšmės valdomos React `useState`:

- šeimos narys: „Visi“ arba pasirinktas esamas šeimos narys;
- gydytojo paieška: laukas „Ieškoti gydytojo...“, ieško gydytojo tekste neatsižvelgiant į didžiąsias / mažąsias raides;
- data: pasirenkama konkreti data;
- būsena: „Visi“, „Suplanuotas“ arba „Atliktas“.

Filtrai sudedami AND principu — rezultatas turi atitikti kiekvieną pasirinktą sąlygą. Kai filtrai tušti, rodomi visi vizitai. Rezultatai rikiuojami pagal datą ir laiką; skaitiklis rodo „Rasta vizitų: N“. Rezultatų kortelės išlaiko esamus veiksmus: suplanuotą galima pažymėti atliktu arba ištrinti, atliktą — atidaryti arba ištrinti.

Filtrų stiliai yra `src/pages/CalendarPage.css` faile, atskiro CSS komponento ar naujos priklausomybės nėra.

## Atlikto vizito atidarymas ir redagavimas

Įgyvendinta šiame pakeitimų rinkinyje:

1. Atlikto vizito kortelę galima atidaryti paspaudus kortelę arba mygtuką „Atidaryti“.
2. `CompletedVisitDialog` peržiūros režime rodo datą, laiką, šeimos narį, gydytoją, būseną „Atliktas“ bei papildomą informaciją.
3. Mygtukas „Redaguoti / papildyti“ atveria formą, kurioje keičiami data, laikas, šeimos narys, gydytojas, vizito rezultatas, pastabos, gydytojo rekomendacijos, vaistai ir kito vizito data.
4. „Išsaugoti“ perduoda tik redaguojamus laukus į `App.jsx`, kur jie įrašomi į `visits` React būseną.
5. `status` redagavimo duomenyse neperduodamas ir todėl išlieka `completed`; redagavimas jo nekeičia į `planned`.
6. „Atšaukti“ atstato formą iš esamų vizito duomenų ir nieko neįrašo į tėvinę React būseną.
7. Jei pakeičiama vizito data, kalendorius perjungiamas į tą mėnesį ir parenkama nauja data.

Susiję failai:

- `src/App.jsx` — `handleUpdateVisit` atnaujina vizitą sujungdamas naujus laukus ankstesniu įrašu; nepakeisti laukai, įskaitant `status`, išsaugomi.
- `src/pages/CalendarPage.jsx` — atlikto vizito atidarymas, dialogo būsena, išsaugojimo callback.
- `src/pages/CalendarPage.css` — atlikto vizito kortelės paspaudimo žymeklis.
- `src/components/CompletedVisitDialog.jsx` — peržiūros, redagavimo, išsaugojimo ir atšaukimo elgsena.
- `src/components/CompletedVisitDialog.css` — dialogo stiliai, pritaikyti esamai temai ir siauriems ekranams.

## Duomenų modelio santrauka

Šeimos narys:

```js
{ id, name }
```

Vizitas:

```js
{
  id,
  date,       // YYYY-MM-DD
  time,       // HH:mm
  memberId,
  doctor,
  status,     // 'planned' | 'completed'
  reminderEnabled,
  reminderMinutes,
  result,
  notes,
  recommendations,
  medications,
  nextVisit,  // YYYY-MM-DD arba tuščia reikšmė
}
```

Papildomos detalės senuose / pavyzdiniuose vizituose gali neegzistuoti; peržiūros lange jos rodomos kaip „Neįrašyta“.

## Saugojimas ir tikrinimas

- Vizitai ir šeimos nariai saugomi tik programos veikimo metu React būsenoje. Perkrovus puslapį vėl užkraunami pradiniai duomenys.
- Nėra duomenų bazės ir tikro prisijungimo.
- `package.json` skriptai: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`.
- Vizitų paieškos pakeitimų metu `git diff --check` praėjo. Build ir testai po paskutinių funkcijų pakeitimų nebuvo paleisti.
- Projekte yra Git repozitorija. Paieškos, rytojaus priminimo ir gydytojų katalogo pakeitimus tikrink su `git status`. Katalogo failai: `src/data/sampleDoctors.js`, `src/pages/DoctorCatalogPage.jsx`, `src/pages/DoctorCatalogPage.css`, taip pat `src/App.jsx` ir `src/pages/CalendarPage.jsx` navigacijai.

## Galima tęsti

Prieš naują funkciją peržiūrėk atitinkamus dabartinius failus, išsiaiškink ar panaši logika jau egzistuoja, tada keisk tik būtiną dalį. Pirmiau aptark ar pasiūlyk failų pakeitimų sąrašą, jei naudotojas to paprašo. Po pakeitimų trumpai nurodyk pakeistus failus ir ar buvo paleisti patikrinimai.
