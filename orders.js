import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

const bestellliste = document.getElementById('bestellliste');
const zusammenfassung = document.getElementById('zusammenfassung');

const q = query(
    collection(db, 'bestellungen'),
    orderBy('timestamp')
);

onSnapshot(q, (snapshot) => {
    bestellliste.innerHTML = '';
    const bestellungen = {};
    snapshot.forEach((doc) => {
        const bestellung = doc.data();
        const li = document.createElement('li');
        li.id = `bestellung-${doc.id}`;
        li.innerHTML = `
            Tisch: ${bestellung.tischnummer} <br>
            Name: ${bestellung.vorname} ${bestellung.nachname} <br>
            Getränk: ${bestellung.getränk}, Menge: ${bestellung.menge}, Preis: €${bestellung.preis.toFixed(2)}, Status: ${bestellung.status}
            <br>
            <button onclick="updateStatus('${doc.id}', 'in Bearbeitung')">In Bearbeitung</button>
            <button onclick="updateStatus('${doc.id}', 'serviert')">Serviert</button>
        `;
        bestellliste.appendChild(li);

        // Kombiniere Vorname und Nachname zu einem Schlüssel
        const kundeName = `${bestellung.vorname} ${bestellung.nachname}`;

        if (!bestellungen[kundeName]) {
            bestellungen[kundeName] = { gesamt: 0, tische: {} };
        }
        bestellungen[kundeName].gesamt += bestellung.preis;
        if (!bestellungen[kundeName].tische[bestellung.tischnummer]) {
            bestellungen[kundeName].tische[bestellung.tischnummer] = 0;
        }
        bestellungen[kundeName].tische[bestellung.tischnummer] += bestellung.preis;
    });

    zusammenfassung.innerHTML = '<h2>Zusammenfassung der Bestellungen</h2>';
    for (const name in bestellungen) {
        const p = document.createElement('p');
        p.innerHTML = `${name} - Gesamtsumme: €${bestellungen[name].gesamt.toFixed(2)}<br> Tische: ${JSON.stringify(bestellungen[name].tische)}`;
        zusammenfassung.appendChild(p);
    }
});


window.updateStatus = async function (id, status) {
    try {
        await updateDoc(doc(db, 'bestellungen', id), {
            status: status
        });
        console.log('Status aktualisiert');
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Status: ', error);
    }
};
