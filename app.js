// app.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Bibliai versek hivatkozásainak betöltése a JSON fájlból
function loadVerseReferences() {
    const filePath = 'data.json';
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`HIBA: A ${filePath} fájl nem található.`);
            return [];
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        if (!content.trim()) {
            console.warn(`FIGYELMEZTETÉS: A ${filePath} fájl üres.`);
            return [];
        }

        const data = JSON.parse(content);
        if (!Array.isArray(data)) {
            console.error(`HIBA: A ${filePath} fájl tartalma nem lista formátumú.`);
            return [];
        }

        if (!data.length) {
            console.warn(`FIGYELMEZTETÉS: A ${filePath} fájl nem tartalmaz hivatkozásokat.`);
        }

        return data;
    } catch (error) {
        console.error(`HIBA: Hiba történt a ${filePath} fájl olvasásakor: ${error}`);
        return [];
    }
}

const verseReferences = loadVerseReferences();

function cleanHtml(text) {
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<[^>]+>/g, '');
    return text.trim();
}

async function getVerse(reference, translation = 'SZIT') {
    const url = `https://szentiras.hu/api/idezet/${reference}/${translation}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const verses = data.valasz.versek;

        const title = verses[0].szoveg.includes('<em>')
            ? cleanHtml(verses[0].szoveg.split('\n')[0])
            : '';

        const fullText = verses.map(verse => cleanHtml(verse.szoveg)).join('\n');

        const cleanedText = title ? fullText.replace(title, '').trim() : fullText;

        return {
            title: title,
            text: cleanedText,
            reference: verses[0].hely.szep,
            translation: data.valasz.forditas.nev
        };

    } catch (error) {
        console.error(`HIBA: Nem sikerült lekérni a verset: ${error}`);
        return null;
    }
}


// log.json olvasása/írása (csak az utolsó vers ID-jét tároljuk)
function loadLog() {
    const filePath = 'log.json';
    try {
        if (!fs.existsSync(filePath)) {
            return { lastVerseId: 0 };
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Hiba a log.json fájl betöltésekor:', error);
        return { lastVerseId: 0 };
    }
}

function saveLog(verseId) {
    const logData = { lastVerseId: verseId };
    fs.writeFileSync('log.json', JSON.stringify(logData, null, 2));
}



app.get('/verse', async (req, res) => {
    const log = loadLog();
    const nextVerseId = (log.lastVerseId + 1) % verseReferences.length;
    const verse = await getVerse(verseReferences[nextVerseId].reference, 'SZIT');

    if (verse) {
        saveLog(nextVerseId); // Mentés minden kérés után
        res.json(verse);
    } else {
        res.status(500).json({ error: "Nem sikerült verset lekérni." });
    }
});


app.listen(port, () => {
    console.log("");
    console.log(`A szerver fut a ${port} porton.`);
    console.log("");
});