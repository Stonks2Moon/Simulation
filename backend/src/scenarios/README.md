## Anforderungen Backend für Szenarien

1.  Kursinformationen (Marktpreis, evtl. gehandeltes Volumen) der Börse werden in einem Graphen angezeigt (historische und aktuelle) **KOMMT VON DER BÖRSE**
2.  4-6 Parameter (TBD) zum Anpassen der Szenarien --> `POST` - neue Parameter beeinflussen laufende und zukünftige Szenarien
    | Endpunkt | Zweck |
    | --- | ---|
    | `GET /scenario` | Abrufen, welches Szenario aktuell läuft, evtl. noch wie viel Restlaufzeit vorhanden und der aktuell gesetzten Parameter|
    | `POST /scenario/:id` | Starten eines Szenarios (optional mit bestimmten Parametern)|
    | `PATCH /scenario/:id` | Setzen der Parameter für aktuelle und zukünftige Szenarien|
