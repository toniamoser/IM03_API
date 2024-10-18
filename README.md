# IM03_API - Energy Musik Challenge von Tonia und Maria
 
## Kurzbeschreibung des Projekts
In unserem Projekt haben wir ein Musikquiz über Radio Energy entwickelt, bei dem die Nutzer erraten sollen, welche Songs in der letzten Woche am häufigsten gespielt wurden. Ziel war es, eine interaktive Anwendung zu schaffen, die die Musikauswahl des Senders widerspiegelt. Das Endprodukt ist ein Quiz über die abgespielten Songs bei Energy mit sechs Fragen und brandaktuellen Antworten.

## Unsere Vorgehensweise

Zuerst haben wir uns überlegt, was wir aus den Daten der Energy-API machen wollen. Wir fanden es eine spannende Idee, ein Quiz zu gestalten, das sich fortlaufend aktualisiert und zwischendurch eine Übersicht oder ein Diagramm zeigt. Im Figma haben wir dann einen Prototyp erstellt, an dem wir uns auch beim coden orientiert haben.
Um das Quiz umzusetzen, haben wir Codes geschrieben, welche die Radio-Energy-Playlisten analysieren und ausgewerten, um die meistgespielten Titel zu ermitteln. Sprich, wir haben die Radio Energy Bern API angezapft und eine Datenbank erstellt, die jede halbe Stunde aktualisiert wird. Die Datenbank sammelt Musiktitel, Künstler, Timestamp und das Albumcover. Wir haben dann mithilfe von Javascript und Unload auch dafür gesorgt, dass die Anzahl Abpsieler gesammelt werden und sich in einen Zeitraum setzen lassen. (Wann wurde welcher Song wie oft abgespielt...) Die erfassten Daten in der Datenbank bilden die Grundlage für das Quiz, das sowohl unterhaltsam ist als auch Musiktrends aufzeigt. Das Quiz bietet, dank der zeitabhängigen Daten, fortlaufend neue Antwortmöglichkeiten. Das heisst, man kann das Quiz wöchentlich spielen und erhält immer neue Daten.

## Schwierigkeiten
Im Verlauf des Projekts sind verschiedene Herausforderungen aufgetreten:

- Datenzugang: Es war nicht einfach, an die Daten zu kommen, die wir wollten. Daten zu sammeln wie beispielsweise, welcher Song wie oft abgespielt wird, stellte sich als kompliziert heraus und erforderte viel Geduld und Hilfe der Dozierenden. ChatGPT war in dem Punkt leider keine gute Hilfe.
- Datenqualität: Die Daten mussten dann noch bereinigt werden. Z.B war am Anfang der meistgespielte Song immer "News Bern". Ausserdem entstanden in der Datenbank durch die API unzählige Duplikate. Diese Daten mussten wir ebenfalls mithilfe der Dozierenden bereinigen.
- Integration ins Quiz: Die Implementierung der Daten in eine dynamische Quizumgebung erwies sich als technisch anspruchsvoll. Es war eine Herausforderung, eine reibungslose Verbindung zwischen der Datenauswertung und dem Quiz-Frontend herzustellen.
- Sinnvolle Statistiken: Bei den Fragenauflösungen wollten wir Anfangs nach jeder Frage ein Diagramm oder eine Auflistung einblenden. Es war schwierig, sinnvolle Daten passend zu den Fragen auszuwerten, weshalb wir es dann bei einem Balkendiagramm und einer Auflistung belassen haben.

## Learnings
Während der Entwicklung des Musikquiz haben wir wertvolle Erfahrungen in mehreren Bereichen gesammelt:

- Datenanalyse: Wir haben gelernt, wie man grosse Datenmengen effizient durch php und js analysiert, filtert und in ein Quizformat umwandelt.
- Benutzerzentriertes UD und UX: Die Gestaltung eines unterhaltsamen und leicht verständlichen Quiz-Interfaces hat uns dabei geholfen, die Bedürfnisse und das Verhalten der Nutzer besser zu verstehen. Das hat vor allem unser Verständnis für CSS und JS verbessert.
- Datenvisualisierung: Der Einsatz von grafischen Darstellungen hat uns geholfen, Daten bzw. Datenbanken sinnvoll zu nutzen und sie in interaktive Medien einzubinden und darzustellen.

## Benutzte Ressourcen
- Programmiersprachen und Frameworks: JavaScript für die interaktive Quiz-Logik, php für das Index, das ETL und das Unload sowie css für das Styling
- Datenbank: Eine SQL-Datenbank auf myphpadmin zur Speicherung der Daten aus der Radio-Energy-API
- Entwicklungsumgebung: Visual Studio Code für die Programmierung und GitHub zur Versionskontrolle und das gemeinsame Arbeiten am Code
- Coden und Programmieren: ChatGPT und ChatGPT4 ink. diversen GPTs wie Code Tutor, um Code zu generieren und fürs Debugging
- W3Schools: Validierung der Codes