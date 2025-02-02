// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
  bier: 3.00
  // Weitere Getränke hier hinzufügen
};

function anpassen(id, wert) {
  const input = document.getElementById(id);
  const neueMenge = parseInt(input.value) + wert;
  if (neueMenge >= 0) {
    input.value = neueMenge;
  }
}

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
      li.textContent = `${getränk} - ${menge} x €${getränkePreise[getränk].toFixed(2)} = €${preis.toFixed(2)}`;
      warenkorbListe.appendChild(li);
    }
  }
  gesamtbetragElement.textContent = `Gesamtbetrag: €${gesamtbetrag.toFixed(2)}`;

  // Modal anzeigen
  const modal = document.getElementById('warenkorbModal');
  modal.style.display = 'block';
}

function modalSchließen() {
  const modal = document.getElementById('warenkorbModal');
  modal.style.display = 'none';
}

document.getElementById('bestellformular').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const tischnummer = document.getElementById('tischnummer').value;

  for (const getränk in getränkePreise) {
    const menge = parseInt(document.getElementById(getränk).value);
    if (menge > 0) {
      const preis = getränkePreise[getränk] * menge;

      try {
        await addDoc(collection(db, 'bestellungen'), {
          name: name,
          tischnummer: tischnummer,
          getränk: getränk,
          menge: menge,
          preis: preis,
          status: 'eingegangen',
          timestamp: serverTimestamp()
        });
      } catch (error) {
        console.error('Fehler beim Aufgeben der Bestellung: ', error);
      }
    }
  }

  alert('Bestellung erfolgreich aufgegeben!');
  document.getElementById('bestellformular').[_{{{CITATION{{{_1{](https://github.com/primefaces/primereact/tree/4a676c58deb4e90977744cf5bb4600c02cee1f63/src%2Fshowcase%2Fliveeditor%2FLiveEditor.js)[_{{{CITATION{{{_2{](https://github.com/xandrman/bitrix-bootstrap-template/tree/5a36588688dc78ea78864e933f45e0e3c13be74a/header.php)[_{{{CITATION{{{_3{](https://github.com/hd-code/pandoc-docker/tree/07f83c6deeafbff1710c5f7992a97955c298ad61/example%2Fexample.md)[_{{{CITATION{{{_4{](https://github.com/AndreasHeine/opcua-sub-to-websocket/tree/b272dca8c8abf371e5e35f05ce93949bdb775723/README.md)