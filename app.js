// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, writeBatch, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkpC3Ok5_IXPLpa3mHUCiBWqWeruEyu0o",
  authDomain: "qrpl-bestellungen.firebaseapp.com",
  projectId: "qrpl-bestellungen",
  storageBucket: "qrpl-bestellungen.firebasestorage.app",
  messagingSenderId: "777777220549",
  appId: "1:777777220549:web:8d06d2a8ce3cb9794199ac",
  measurementId: "G-4L916X16F7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getränkePreise = {
  fritzZitrone: 3.20,
  fritzOrange: 3.20,
  fritzApfel: 3.20,
  fritzRhabarber: 3.20,
  fritzMelone: 3.20,
  fritzKola: 3.20,
  fritzKolaZuckerfrei: 3.20,
  clubMate: 3.70,
  wasserLautKlein: 2.50,
  wasserLeiseKlein: 2.50,
  wasserLautGroß: 4.00,
  wasserLeiseGroß: 4.00,
  becks: 3.50,
  becksBlue: 3.50,
  astra: 2.80,
  alster: 2.80,
  weizen: 4.50,
  spaten: 4.50,
  riesling: 5.50,
  rieslingSchorle: 5.00,
  grauburgunder: 7.00,
  grauburgunderSchorle: 5.60,
  merlot: 6.50,
  prosecco: 3.90,
  proseccoAufEis: 6.30,
  mimosa: 3.80,
  sektMate: 7.80,
  sektflasche: 22.00,
  tanquerayTonic: 8.80,
  moscowMule: 8.80,
  aperolSpritz: 8.20,
  wildTurkeyCola: 8.50,
  wodkaMate: 8.50,
  cubaLibre: 8.80,
  darkNStormy: 8.80,
  caipirinha: 9.30,
  mojito: 9.30,
  hugo: 8.20,
  cocktailAlkoholfrei: 6.30,
  jägermeister: 3.00,
  wodka: 3.00,
  helbing: 3.00,
  pfeffi: 3.00,
  frangelico: 3.00,
  wildTurkey: 3.00,
  averna: 3.00,
  mexikaner: 3.00,
  cafeCrema: 3.00,
  cappuccinoKuhmilch: 3.40,
  cappuccinoHafermilch: 3.40,
  espresso: 2.50,
  frischerIngwertee: 3.50,
  frischerPfefferminztee: 3.50
  // Weitere Getränke hier hinzufügen
};

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

window.onload = function() {
    const tischnummer = getParameterByName('tischnummer');
    const gültigeTische = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']; // Füge hier alle deine gültigen Tischnummern ein

    if (tischnummer && gültigeTische.includes(tischnummer)) {
        const tischnummerInput = document.getElementById('tischnummer');
        tischnummerInput.value = tischnummer;
        tischnummerInput.disabled = true; // Deaktiviert das Feld, damit der Gast es nicht ändern kann
    } else {
        alert('Ungültige oder fehlende Tischnummer. Bitte scanne den QR-Code auf deinem Tisch.');
        // Optional: Weiterleitung zu einer Fehlerseite oder Anzeige einer Meldung
    }
};

function anpassen(id, wert) {
    const input = document.getElementById(id);
    if (!input) {
        console.error(`Element mit ID '${id}' nicht gefunden.`);
        return;
    }
    let neueMenge = parseInt(input.value) + wert;
    if (neueMenge < 0) neueMenge = 0;
    input.value = neueMenge;
}

window.anpassen = anpassen; // Macht die Funktion global verfügbar


function zumWarenkorb() {
    const warenkorbListe = document.getElementById('warenkorbListe');
    const gesamtbetragElement = document.getElementById('gesamtbetrag');
    let gesamtbetrag = 0;
    warenkorbListe.innerHTML = '';

    for (const getränk in getränkePreise) {
        const menge = parseInt(document.getElementById(getränk).value);
        if (menge > 0) {
            const preis = getränkePreise[getränk] * menge;
            gesamtbetrag += preis;

            const li = document.createElement('li');
            li.textContent = `${getränk.charAt(0).toUpperCase() + getränk.slice(1)} - ${menge} x €${getränkePreise[getränk].toFixed(2)} = €${preis.toFixed(2)}`;
            warenkorbListe.appendChild(li);
        }
    }

    if (gesamtbetrag === 0) {
        alert('Bitte wähle mindestens ein Getränk aus.');
        return;
    }

    gesamtbetragElement.textContent = `Gesamtbetrag: €${gesamtbetrag.toFixed(2)}`;

    // Modal anzeigen
    const modal = document.getElementById('warenkorbModal');
    modal.style.display = 'block';
}

window.zumWarenkorb = zumWarenkorb;

function modalSchließen() {
    const modal = document.getElementById('warenkorbModal');
    modal.style.display = 'none';
}

window.modalSchließen = modalSchließen;

async function bestellungAbschließen() {
    const vornameInput = document.getElementById('vorname');
    const nachnameInput = document.getElementById('nachname');
    const tischnummerInput = document.getElementById('tischnummer');

    if (!vornameInput || !nachnameInput || !tischnummerInput) {
        alert('Bitte gib deinen Vor- und Nachnamen sowie die Tischnummer an.');
        modalSchließen();
        return;
    }

    const vorname = vornameInput.value.trim();
    const nachname = nachnameInput.value.trim();
    const tischnummer = tischnummerInput.value.trim();

    if (!vorname || !nachname || !tischnummer) {
        alert('Bitte fülle alle Felder aus.');
        modalSchließen();
        return;
    }

    const getränkeListe = [];
    let gesamtpreis = 0;

    for (const getränk in getränkePreise) {
        const menge = parseInt(document.getElementById(getränk).value);
        if (menge > 0) {
            const preis = getränkePreise[getränk] * menge;
            gesamtpreis += preis;

            getränkeListe.push({
                getränk: getränk,
                menge: menge,
                preis: preis
            });
        }
    }

    if (getränkeListe.length === 0) {
        alert('Bitte wähle mindestens ein Getränk aus.');
        modalSchließen();
        return;
    }

    try {
        await addDoc(collection(db, 'bestellungen'), {
            vorname: vorname,
            nachname: nachname,
            tischnummer: tischnummer,
            getränke: getränkeListe,
            gesamtpreis: gesamtpreis,
            status: 'eingegangen',
            timestamp: serverTimestamp()
        });

        alert('Bestellung erfolgreich aufgegeben!');
        document.getElementById('bestellformular').reset();
        modalSchließen();
		
		window.location.href = window.location.href.split('?')[0] + '?tischnummer=' + encodeURIComponent(tischnummer);
    } catch (error) {
        console.error('Fehler beim Aufgeben der Bestellung:', error);
        alert('Es gab ein Problem mit deiner Bestellung. Bitte versuche es erneut.');
    }
}

window.bestellungAbschließen = bestellungAbschließen;


