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

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const bestellliste = document.getElementById('bestellliste');
const zusammenfassung = document.getElementById('zusammenfassung');
const erledigteBestellungen = document.getElementById('erledigteBestellungen');

const q = query(
    collection(db, 'bestellungen'),
    orderBy('timestamp'),
    orderBy('tischnummer')
);

onSnapshot(q, (snapshot) => {
    if (bestellliste && zusammenfassung && erledigteBestellungen) {
        bestellliste.innerHTML = '';
        zusammenfassung.innerHTML = '';
        erledigteBestellungen.innerHTML = ''; // Listen zurücksetzen

        const zusammenfassungen = {}; // Für die Gesamtsummen pro Gast
        let bestellNummer = 1; // Initiale Bestellnummer

        snapshot.forEach((doc) => {
            const bestellung = doc.data();
            const li = document.createElement('li');
            li.id = `bestellung-${doc.id}`;

            // Hinzufügen der CSS-Klasse basierend auf dem Status
            let statusKlasse = '';
            if (bestellung.status === 'eingegangen') {
                statusKlasse = 'eingegangen';
            } else if (bestellung.status === 'in Bearbeitung') {
                statusKlasse = 'in-bearbeitung';
            } else if (bestellung.status === 'serviert') {
                statusKlasse = 'serviert';
            } else if (bestellung.status === 'bezahlt') {
                statusKlasse = 'bezahlt';
            }

            // Konvertiere Timestamp zu einem lesbaren Format
            const timestamp = bestellung.timestamp.toDate();
            const timestampStr = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();

            // Getränke anzeigen (ohne Preise)
            let getraenkeHTML = '';
            bestellung.getraenke.forEach((item) => {
                getraenkeHTML += `${item.getraenk.charAt(0).toUpperCase() + item.getraenk.slice(1)} x${item.menge}<br>`;
            });

            li.innerHTML = `
                <strong>Bestellnummer:</strong> ${bestellNummer++}<br>
                <strong>Bestellzeit:</strong> ${timestampStr}<br>
                <strong>Tisch:</strong> ${bestellung.tischnummer}<br>
                <strong>Name:</strong> ${bestellung.vorname} ${bestellung.nachname}<br>
                <strong>Getränke:</strong><br>
                ${getraenkeHTML}
                <strong>Status:</strong> ${bestellung.status}
                <br>
                <button onclick="updateStatus('${doc.id}', 'in Bearbeitung')">In Bearbeitung</button>
                <button onclick="updateStatus('${doc.id}', 'serviert')">Serviert</button>
            `;
            li.classList.add(statusKlasse);

            // Füge Bestellung der Liste hinzu oder verschiebe sie zu den erledigten Bestellungen
            if (bestellung.status === 'serviert' || bestellung.status === 'bezahlt') {
                erledigteBestellungen.appendChild(li);
            } else {
                bestellliste.appendChild(li);
            }

            // Zusammenfassung vorbereiten
            const kundeName = `${bestellung.vorname} ${bestellung.nachname}`;
            if (!zusammenfassungen[kundeName]) {
                zusammenfassungen[kundeName] = {
                    tischnummer: bestellung.tischnummer,
                    gesamtpreis: 0,
                    getraenkeDetails: [],
                    bezahlt: false // Initial als nicht bezahlt markieren
                };
            }

            zusammenfassungen[kundeName].gesamtpreis += bestellung.gesamtpreis;

            // Getränke mit Preisen hinzufügen
            bestellung.getraenke.forEach((item) => {
                zusammenfassungen[kundeName].getraenkeDetails.push({
                    getraenk: item.getraenk,
                    menge: item.menge,
                    preis: item.preis
                });
            });
        });

        // Zusammenfassung der Bestellungen pro Gast alphabetisch sortieren
        const summaryTitle = document.createElement('h2');
        summaryTitle.textContent = 'Zusammenfassung der Bestellungen';
        zusammenfassung.appendChild(summaryTitle);

        const sortedKunden = Object.keys(zusammenfassungen).sort();

        sortedKunden.forEach(kunde => {
            const kundeData = zusammenfassungen[kunde];
            const div = document.createElement('div');
            div.classList.add('kunde-zusammenfassung');

            let getraenkeDetailsHTML = '';
            kundeData.getraenkeDetails.forEach((item) => {
                getraenkeDetailsHTML += `${item.getraenk.charAt(0).toUpperCase() + item.getraenk.slice(1)} x${item.menge} - €${item.preis.toFixed(2)}<br>`;
            });

            div.innerHTML = `
                <strong>Name:</strong> ${kunde} <br>
                <strong>Tischnummer:</strong> ${kundeData.tischnummer} <br>
                <strong>Getränke:</strong><br>
                ${getraenkeDetailsHTML}
                <strong>Gesamtbetrag:</strong> €${kundeData.gesamtpreis.toFixed(2)}
                <label>
                    <input type="checkbox" onchange="togglePaymentStatus(this)">
                    Bezahlt
                </label>
                <hr>
            `;
            zusammenfassung.appendChild(div);
        });
    } else {
        console.error("Ein oder mehrere Elemente wurden nicht im DOM gefunden.");
    }
});

window.updateStatus = async function (id, status) {
    try {
        await updateDoc(doc(db, 'bestellungen', id), { status: status });
        console.log('Status aktualisiert');
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Status:', error);
        if (error.code === 'permission-denied') {
            alert('Fehler: Fehlende oder unzureichende Berechtigungen. Bitte überprüfe die Firebase-Sicherheitsregeln.');
        }
    }
};

window.togglePaymentStatus = function (checkbox) {
    checkbox.parentElement.parentElement.classList.toggle('bezahlt', checkbox.checked);
};
