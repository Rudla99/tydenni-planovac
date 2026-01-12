# Týdenní Plánovač - Zadání pro Claude Code

## Přehled projektu

Vytvoř webovou aplikaci "Týdenní Plánovač" pro plánování pracovních úkolů. Aplikace umožňuje uživateli spravovat úkoly, přetahovat je do týdenního rozvrhu (Po-Pá), sledovat historii všech týdnů a analyzovat statistiky podle kategorií.

## Technický stack

- **React 18** s funkcionálními komponentami a hooks
- **Vite** jako build tool
- **Tailwind CSS** pro styling
- **Recharts** pro grafy a statistiky
- **LocalStorage** pro persistenci dat
- **date-fns** pro práci s daty a týdny

## Datová struktura

```javascript
// Hlavní struktura v localStorage pod klíčem "weekly-planner-data"
{
  // Kategorie úkolů
  categories: [
    { id: "cat_1", name: "Vývoj", color: "#7c3aed" },
    { id: "cat_2", name: "Meetingy", color: "#10b981" },
    { id: "cat_3", name: "Administrativa", color: "#f59e0b" },
    // ...
  ],
  
  // Týdny - klíč je ISO week (YYYY-Www)
  weeks: {
    "2025-W03": {
      tasks: [
        {
          id: "task_1705312345678",
          title: "Připravit prezentaci",
          categoryId: "cat_1",        // reference na kategorii (může být null)
          duration: 2,                 // hodiny (0.25 - 12)
          scheduledDay: "mon",         // null | "mon" | "tue" | "wed" | "thu" | "fri"
          order: 0,                    // pořadí v rámci dne
          completed: false,            // zda je úkol dokončený
          createdAt: "2025-01-13T08:00:00Z"
        },
        // ...
      ]
    },
    "2025-W04": {
      tasks: [...]
    }
  },
  
  // Nastavení
  settings: {
    hoursPerDay: 8,                   // pracovní hodiny za den
    defaultDuration: 1,               // výchozí délka nového úkolu
    showCompletedTasks: true          // zobrazovat dokončené úkoly
  }
}
```

## Struktura aplikace

```
tydenni-planovac/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                      # Entry point
│   ├── App.jsx                       # Hlavní komponenta s routingem
│   ├── index.css                     # Tailwind imports + custom styly
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx            # Hlavička s navigací mezi týdny
│   │   │   └── Sidebar.jsx           # Levý panel se seznamem úkolů
│   │   │
│   │   ├── tasks/
│   │   │   ├── TaskList.jsx          # Seznam všech úkolů (levý panel)
│   │   │   ├── TaskCard.jsx          # Karta úkolu v seznamu
│   │   │   ├── TaskForm.jsx          # Formulář pro přidání/editaci úkolu
│   │   │   ├── ScheduledTask.jsx     # Úkol v rozvrhu (jiný vzhled)
│   │   │   └── DurationEditor.jsx    # Editor délky úkolu
│   │   │
│   │   ├── calendar/
│   │   │   ├── WeekView.jsx          # Týdenní rozvrh (5 sloupců)
│   │   │   ├── DayColumn.jsx         # Jeden den v rozvrhu
│   │   │   └── DropIndicator.jsx     # Indikátor pro drag & drop
│   │   │
│   │   ├── categories/
│   │   │   ├── CategoryManager.jsx   # Správa kategorií (modal)
│   │   │   ├── CategoryBadge.jsx     # Barevný badge kategorie
│   │   │   └── CategoryPicker.jsx    # Výběr kategorie pro úkol
│   │   │
│   │   ├── statistics/
│   │   │   ├── StatisticsView.jsx    # Hlavní view statistik
│   │   │   ├── WeeklyChart.jsx       # Graf hodin po týdnech
│   │   │   ├── CategoryPieChart.jsx  # Koláčový graf kategorií
│   │   │   └── StatsSummary.jsx      # Souhrnné statistiky
│   │   │
│   │   ├── weekTransfer/
│   │   │   └── TransferTasksModal.jsx # Modal pro přenos úkolů
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Input.jsx
│   │       └── ColorPicker.jsx
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js        # Hook pro práci s localStorage
│   │   ├── useTasks.js               # Hook pro CRUD operace s úkoly
│   │   ├── useCategories.js          # Hook pro správu kategorií
│   │   ├── useWeekNavigation.js      # Hook pro navigaci mezi týdny
│   │   └── useDragAndDrop.js         # Hook pro drag & drop logiku
│   │
│   ├── utils/
│   │   ├── weekHelpers.js            # Pomocné funkce pro týdny (getWeekKey, getWeekDates, ...)
│   │   ├── taskHelpers.js            # Pomocné funkce pro úkoly
│   │   └── statsHelpers.js           # Výpočty statistik
│   │
│   └── constants/
│       ├── days.js                   # Definice dnů (Po-Pá)
│       └── colors.js                 # Paleta barev pro kategorie
```

## Detailní popis funkcí

### 1. Navigace mezi týdny (Header.jsx)

**UI komponenty:**
- Tlačítko "← Předchozí týden"
- Zobrazení aktuálního týdne: "13. - 17. ledna 2025 (Týden 3)"
- Tlačítko "Další týden →"
- Tlačítko "Dnes" (rychlý návrat na aktuální týden)
- Tlačítko "Statistiky" (otevře statistiky)
- Tlačítko "Kategorie" (otevře správu kategorií)

**Logika:**
- Použij `date-fns` funkce: `getISOWeek`, `startOfWeek`, `endOfWeek`, `addWeeks`, `subWeeks`
- Klíč týdne ve formátu ISO: `2025-W03`
- Při přechodu na nový týden, pokud týden neexistuje, vytvoř ho s prázdným polem úkolů

### 2. Seznam úkolů (Sidebar - TaskList.jsx)

**UI komponenty:**
- Nadpis "Všechny úkoly" s počtem
- Input pro přidání nového úkolu + tlačítko "+"
- Seznam úkolů (TaskCard komponenty)
- Každý úkol zobrazuje:
  - Název úkolu
  - Badge s délkou (kliknutím editace)
  - Badge kategorie (barevný, kliknutím změna)
  - Pokud je naplánovaný: badge "✓ V plánu" + den (Po/Út/St/Čt/Pá)
  - Checkbox pro označení dokončení
  - Tlačítko ✕ pro smazání (zobrazí se při hoveru)

**Drag & Drop:**
- Úkoly lze přetáhnout do rozvrhu
- Pokud přetáhnu úkol Z rozvrhu zpět do seznamu → odebere se z rozvrhu
- Celý panel se rozsvítí při přetahování naplánovaného úkolu nad něj

**Vizuální odlišení:**
- Naplánované úkoly mají zelený levý okraj
- Dokončené úkoly jsou přeškrtnuté a průhledné

### 3. Týdenní rozvrh (WeekView.jsx + DayColumn.jsx)

**UI komponenty:**
- 5 sloupců (Po, Út, St, Čt, Pá)
- Každý sloupec má:
  - Hlavičku s názvem dne a datem (např. "Pondělí 13.1.")
  - Počítadlo hodin: "5.5 / 8 hod" (červeně pokud > 8)
  - Oblast pro úkoly

**Úkoly v rozvrhu (ScheduledTask.jsx):**
- Výška úkolu odpovídá délce (delší úkol = vyšší karta)
  - Vzorec: `minHeight = 56 + (duration - 0.5) * 44` px
- Zobrazuje:
  - Pořadové číslo v kruhu (1, 2, 3...)
  - Název úkolu
  - Délku (kliknutím editace)
  - Barevný proužek kategorie vlevo
- Při hoveru:
  - Číslo zmizí, objeví se tlačítko ✕ pro odebrání z rozvrhu
- Checkbox pro označení dokončení

**Drag & Drop:**
- Úkoly lze přetahovat mezi dny
- Úkoly lze řadit v rámci dne (změna pořadí)
- Při přetahování zobrazit drop indikátor (fialová čára)
- Při přetažení do seznamu vlevo → odebrat z rozvrhu

### 4. Kategorie (CategoryManager.jsx)

**Modal pro správu kategorií:**
- Seznam existujících kategorií
- Každá kategorie:
  - Barevný čtvereček
  - Název
  - Tlačítko pro editaci
  - Tlačítko pro smazání (jen pokud není použita)
- Formulář pro přidání nové:
  - Input pro název
  - ColorPicker (předdefinované barvy)
  - Tlačítko "Přidat"

**Výchozí kategorie (při prvním spuštění):**
```javascript
[
  { id: "cat_dev", name: "Vývoj", color: "#7c3aed" },
  { id: "cat_meet", name: "Meetingy", color: "#10b981" },
  { id: "cat_admin", name: "Administrativa", color: "#f59e0b" },
  { id: "cat_plan", name: "Plánování", color: "#06b6d4" },
  { id: "cat_other", name: "Ostatní", color: "#6b7280" },
]
```

**CategoryPicker (v TaskCard a TaskForm):**
- Dropdown/popover s výběrem kategorie
- Možnost "Bez kategorie"
- Zobrazuje barevné čtverečky

### 5. Přenos úkolů do nového týdne (TransferTasksModal.jsx)

**Kdy se zobrazí:**
- Když uživatel přejde na týden, který ještě neexistuje (je prázdný)
- Nebo tlačítkem "Přenést úkoly z minulého týdne"

**Možnosti přenosu:**
1. **Přenést všechny** - zkopíruje všechny úkoly (bez scheduledDay a completed)
2. **Jen nezařazené** - zkopíruje jen úkoly kde `scheduledDay === null`
3. **Jen nedokončené** - zkopíruje jen úkoly kde `completed === false`
4. **Vybrat ručně** - zobrazí checkboxy u každého úkolu

**UI:**
- Radio buttony pro výběr režimu
- Pokud "Vybrat ručně" → seznam úkolů s checkboxy
- Náhled: "Bude přeneseno X úkolů"
- Tlačítka: "Přenést" / "Začít s prázdným týdnem"

**Logika přenosu:**
- Vytvoř kopie úkolů s novými ID
- Nastav `scheduledDay: null`, `completed: false`
- Zachovej `title`, `categoryId`, `duration`

### 6. Statistiky (StatisticsView.jsx)

**Zobrazení:**
- Celková stránka/modal se statistikami
- Filtr období: "Tento měsíc" / "Poslední 3 měsíce" / "Celé období" / Vlastní rozsah

**Grafy a metriky:**

**a) Souhrnné statistiky (StatsSummary.jsx):**
- Celkem odpracováno: XXX hodin
- Průměrně za týden: XX hodin
- Nejproduktivnější den: Středa
- Počet dokončených úkolů: XXX

**b) Graf hodin po týdnech (WeeklyChart.jsx):**
- Sloupcový graf (Recharts BarChart)
- X osa: týdny (W1, W2, W3...)
- Y osa: hodiny
- Sloupce rozdělené podle kategorií (stacked bar chart)

**c) Koláčový graf kategorií (CategoryPieChart.jsx):**
- Koláčový graf (Recharts PieChart)
- Podíl hodin podle kategorií
- Legenda s počtem hodin

**d) Tabulka kategorií:**
- Kategorie | Hodiny | % | Průměr/týden
- Seřazeno od nejvíce po nejméně

### 7. Editor délky úkolu (DurationEditor.jsx)

**UI:**
- Kliknutím na badge délky se otevře editor
- Předvolby: 30m, 1h, 1.5h, 2h, 3h, 4h, 6h, 8h
- Vlastní hodnota: input + tlačítko OK
- Min: 0.25 (15 min), Max: 12 hodin

**Zobrazení délky:**
- Pod 1 hodinu: "30 min", "45 min"
- 1 hodina a více: "1 hod", "2.5 hod"

## Vizuální styl

**Barevná paleta:**
```css
--bg-primary: #1a1a2e;      /* Tmavé pozadí */
--bg-secondary: #16213e;    /* Sekundární pozadí */
--bg-tertiary: #0f3460;     /* Terciární pozadí */
--text-primary: #e4e4e7;    /* Hlavní text */
--text-secondary: #a1a1aa;  /* Sekundární text */
--text-muted: #71717a;      /* Tlumený text */
--accent-primary: #7c3aed;  /* Hlavní akcent (fialová) */
--accent-secondary: #00d4ff; /* Sekundární akcent (cyan) */
--success: #10b981;         /* Úspěch (zelená) */
--warning: #f59e0b;         /* Varování (oranžová) */
--danger: #ef4444;          /* Nebezpečí (červená) */
```

**Fonty:**
- Nadpisy: 'Space Grotesk', sans-serif
- Tělo: 'Segoe UI', system-ui, sans-serif  
- Monospace (čísla, časy): 'JetBrains Mono', monospace

**Efekty:**
- Glassmorphism na panelech: `backdrop-filter: blur(20px)`, poloprůhledné pozadí
- Gradient na nadpisu: `linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)`
- Jemné stíny a glow efekty na hover
- Plynulé animace (transition: all 0.2s)

## Pomocné funkce

### weekHelpers.js
```javascript
// Vrátí ISO klíč týdne pro dané datum
getWeekKey(date) → "2025-W03"

// Vrátí datum pondělí a pátku daného týdne
getWeekRange(weekKey) → { start: Date, end: Date }

// Vrátí pole dnů s daty pro daný týden
getWeekDays(weekKey) → [
  { id: "mon", name: "Pondělí", date: Date },
  ...
]

// Vrátí aktuální týden
getCurrentWeekKey() → "2025-W03"

// Posun o týden
getNextWeek(weekKey) → "2025-W04"
getPrevWeek(weekKey) → "2025-W02"

// Formátování pro zobrazení
formatWeekRange(weekKey) → "13. - 17. ledna 2025"
formatWeekNumber(weekKey) → "Týden 3"
```

### statsHelpers.js
```javascript
// Celkové hodiny za období
getTotalHours(weeks, fromWeek, toWeek) → number

// Hodiny podle kategorie
getHoursByCategory(weeks, categories, fromWeek, toWeek) → [
  { categoryId, categoryName, color, hours, percentage }
]

// Data pro týdenní graf
getWeeklyChartData(weeks, fromWeek, toWeek) → [
  { week: "W03", ...categoryHours, total }
]

// Nejproduktivnější den
getMostProductiveDay(weeks) → "wed"
```

## Požadavky na implementaci

1. **Responsive design** - funguje na desktopu i tabletu (min-width: 768px)

2. **Persistence** - všechna data se ukládají do localStorage při každé změně

3. **Prázdný stav** - hezké empty states s ikonami a textem

4. **Loading states** - indikátor při načítání dat

5. **Potvrzovací dialogy** - před smazáním úkolu/kategorie

6. **Klávesové zkratky:**
   - Enter v inputu přidá úkol
   - Escape zavře modaly

7. **Drag & Drop** - použij HTML5 Drag and Drop API (jako v původní verzi)

8. **Žádné externí backend** - vše běží lokálně v prohlížeči

## Spuštění projektu

```bash
# Vytvoření projektu
npm create vite@latest tydenni-planovac -- --template react

# Instalace závislostí
cd tydenni-planovac
npm install
npm install tailwindcss postcss autoprefixer
npm install recharts date-fns

# Inicializace Tailwind
npx tailwindcss init -p

# Spuštění dev serveru
npm run dev
```

## Pořadí implementace (doporučené)

1. Základní struktura projektu + Tailwind setup
2. Layout (Header, Sidebar, WeekView)
3. Datová vrstva (hooks pro localStorage, tasks, weeks)
4. Seznam úkolů + přidávání
5. Týdenní rozvrh + drag & drop
6. Navigace mezi týdny
7. Kategorie
8. Přenos úkolů mezi týdny
9. Statistiky a grafy
10. Polish (animace, empty states, responzivita)

---

## Původní fungující verze

Pro referenci přikládám původní fungující kód jako jeden HTML soubor. Logika drag & drop a základní UI je funkční a můžeš z něj vycházet:

[Viz soubor tydenni-planovac.html který jsme vytvořili dříve]
