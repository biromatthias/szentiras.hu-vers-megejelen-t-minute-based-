# Bibliai Vers Megjelenítő (Perc alapú)

Ez az alkalmazás egy bibliai verset jelenít meg, és (percben) meghatározott időközönként automatikusan frissül. A megjelenített vers a `data.json` fájlban található hivatkozásokból kerül kiválasztásra, és a szentiras.hu API-ját használja a vers szövegének lekéréséhez.

## Előkészületek 🚀

1. **Node.js és npm telepítése:** Győződj meg róla, hogy a gépeden telepítve van a Node.js 16 vagy újabb verziója és az npm (Node Package Manager). A telepítés módja az operációs rendszered függvénye (lásd: [Node.js hivatalos weboldal](https://nodejs.org/)).

2. **Függőségek telepítése:** Klónozd le a projektet, majd navigálj a projekt könyvtárába a terminálon/parancssoron keresztül. Telepítsd a szükséges függőségeket a `package.json` fájl alapján:

   ```bash
   npm install
   ```

3. **`data.json` fájl:** A `data.json` fájl tartalmazza a bibliai versek hivatkozásait. **Ez a fájl JSON formátumban van, és minden vers egy objektumként van reprezentálva egy egyedi azonosítóval (`id`) és egy hivatkozással (`reference`):**

   ```json
   [
       {"id": 1, "reference": "Jn3,16-17"},
       {"id": 2, "reference": "1Kor13,4-7"},
       // ... többi vers ...
   ]
   ```

   **Ha más verseket szeretnél megjeleníteni, módosítsd ezt a fájlt.** A `reference` mezőbe írd be a szentiras.hu API által elfogadható bibliai vers hivatkozást.

4. **`landscape_sunset.jpg` háttérkép:** A HTML fájl egy háttérképet használ. **Cseréld le a `landscape_sunset.jpg` elérési útját a saját képfájlra.** Győződj meg róla, hogy a fájl a megfelelő helyen van, vagy módosítsd az elérési utat a `index_2.0.html` fájlban.

5. **`log.json` fájl:** Ez a fájl a legutóbb megjelenített vers azonosítóját tárolja. Ez automatikusan létrejön, ha a szerver elindul először.

## Szerver futtatása ⚙️

1. **Indítsd el a szervert:** A projekt könyvtárában futtasd a következő parancsot a terminálon/parancssoron:

   ```bash
   node app.js
   ```

2. **Nyisd meg a böngészőben:** Nyisd meg a `index_2.0.html` fájlt egy webböngészőben. Alapértelmezésben a `http://localhost:5000` címen érhető el.

## Működés 💡

Az alkalmazás a `index_2.0.html` fájlban beállított időközönként kér le egy új bibliai verset a szervertől. A szerver a `log.json` fájlban tárolja az utoljára megjelenített vers azonosítóját. Minden kéréskor a szerver növeli ezt az azonosítót, és a `data.json` fájlból kikeresi a következő verset. Ha a lista végére ér,  újrakezdi az elejétől. A szentiras.hu API-ját használja a vers szövegének lekéréséhez.  A frissítési időköz a HTML fájlban állítható be.

## 🕒 Frissítési időköz beállítása

**A frissítési időköz a `index_2.0.html` fájlban, a  `refreshIntervalMinutes` változóban állítható be (percben megadva).**

```javascript
const refreshIntervalMinutes = 1; // Itt állíthatod be a frissítési időközt percben (pl. 2 órához: 120)
```

## ⚙️ Fordítás módosítása

A script alapértelmezésben a SZIT fordítást használja. Ha másik fordítást szeretnél használni, módosítsd a `getVerse` függvényben a `translation` paraméter értékét az `app.js` fájlban:

```javascript
async function getVerse(reference, translation = 'SZIT') // <- Itt módosíthatod a fordítást
{
    // ...
}
```

## ❗❗❗ Fontos

Mivel a program a konkrét szentírási részt nyeri ki a szentiras.hu-ból, ezért vesszőhibák, idézőjelhibák és félbehagyott mondatok keletkezhetnek:

Például: Józsue könyve: [Józsue könyve: 1. fejezet](https://szentiras.hu/SZIT/J%C3%B3zs1) ➡️ [9-es rész](https://szentiras.hu/SZIT/J%C3%B3zs1,9)

Hát nem azt a parancsot adtam neked, `9` hogy légy...

Mivel az 1. fejezet `9` része itt kezdődik, ezért így fog kinézni:

_hogy légy erős és kitartó? Ne félj és ne aggódj tehát, mert az Úr, a te Istened veled lesz mindenütt, ahova csak mész.”_


## Lehetséges hibák és megoldásaik ⚠️

* **Hiba a vers lekérése közben:** Ellenőrizd az internetkapcsolatodat, és hogy a szentiras.hu API elérhető-e.
* **Hiba a `data.json` fájl olvasásakor:** Ellenőrizd, hogy a `data.json` fájl létezik, és helyes a formátuma.
* **`log.json` problémák:** A `log.json` fájl törlése megoldhatja az esetleges problémákat, de a program újrakezdi a versválasztást az első versetől.


Jó olvasgatást! 🙏
