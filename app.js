// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

document.getElementById('bestellformular').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const tischnummer = document.getElementById('tischnummer').value;
    const getränkSelect = document.getElementById('getränk');
    const getränk = getränkSelect.value;
    const preis = parseFloat(getränkSelect.options[getränkSelect.selectedIndex].getAttribute('data-preis'));
    const menge = parseInt(document.getElementById('menge').value, 10);
    const gesamtpreis = preis * menge;

    try {
        await addDoc(collection(db, 'bestellungen'), {
            name: name,
            tischnummer: tischnummer,
            getränk: getränk,
            menge: menge,
            preis: gesamtpreis,
            status: 'eingegangen',
            timestamp: serverTimestamp()
        });
        alert('Bestellung erfolgreich aufgegeben!');
        document.getElementById('bestellformular').reset();
    } catch (error) {
        console.error('Fehler beim Aufgeben der Bestellung: ', error);
    }
});
