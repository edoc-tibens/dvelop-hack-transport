# Transportsystem für Dokumente über Tenants hinweg
## Emailadressen und Links

* [Git Repo](https://github.com/edoc-tibens/dvelop-hack-transport)
* [d.3 Tenant](https://edoc-tibens-dev.d-velop.cloud)
* [d.3 tenant](https://hackathon-dev-target.d-velop.cloud/home/features)
## Use Case
Dokumente im Dev vorbereiten um sie dann ins prod/qa zu schieben
z.B. von prod auf test dokumente rüberschaufeln um zu testen

## Must have
* Dokumente suchen und selektieren (Kontextaktion zu Listen DmsObjectListContextAction) - **Done**
* Authentifizierung mit API Keys - **Done**
* Datenhaltung via local file - **Done**

## Should have
* Konfiguration, um Dokumentkategorien zu mappen
* Konfiguration, um nur bestimmte Kategorien zu transportieren
* UI, um Tenants und Kategorien auszuwählen - **Done**

## Nice to have
* Dokumenteigenschaften gegenprüfen - **Done**
* Funky Auth mit Trust Relationships
* Datenhaltung via MySQL?
* Warnhinweis wenn Kategorie nicht auf target existiert
* Gruppierung nach Kategorien - warnhinweis wenn kategorie nciht auf target existiert
* Matching von nicht vorhandenen Kategorien - properties

## Endpunkte
* Config Endpunkt für Einstellung Tenant ids (base url, api keys)
* /dmsobjectextension für Kontextaktion an der Liste

## Prämissen
* Der importierende Benutzer auf Tenant 2 muss nicht gleich dem importierenden Benutzer auf Tenant 1 sein
* Wenn die Kategorie auf beiden Tenants existiert, gehen wir davon aus, dass die Attribute usw. gleich sind

