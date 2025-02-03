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
  wasser: 1.00,
  cola: 2.50,
  whisky cola: 5.00,
  gin tonic: 5.00,
  bier: 3.00
  // Weitere Getränke hier hinzufügen
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
    } catch (error) {
        console.error('Fehler beim Aufgeben der Bestellung:', error);
        alert('Es gab ein Problem mit deiner Bestellung. Bitte versuche es erneut.');
    }
}

window.bestellungAbschließen = bestellungAbschließen;


