# MyTasks – Minimalne ToDo

Aplikacja webowa typu **PWA** do zarządzania zadaniami z funkcjami offline, powiadomień i geolokalizacji.

---

## Demo

Aplikacja dostępna online (przykład hostingu HTTPS, jeśli wdrożysz):  
[Twój link do hostingu]

---

## Technologie

- **HTML5**  
- **CSS3** (Flexbox, Grid, Media Queries)  
- **JavaScript** (ES6+)  
- **Service Worker** i **Cache API** do obsługi offline  
- **Manifest PWA** do instalacji na urządzeniu  

---

## Funkcjonalności

1. **Tworzenie, edycja i usuwanie zadań**  
2. **Oznaczanie zadań jako ukończone**  
3. **Kalendarz z podświetleniem dni z zadaniami**  
4. **Wyświetlanie zadań dla wybranej daty z możliwością oznaczenia jako ukończone/nieukończone**  
5. **Powiadomienia push** – użytkownik może włączyć/wyłączyć powiadomienia o nowych zadaniach  
6. **Geolokalizacja** – pokazuje miasto i region użytkownika  
7. **Offline mode** – aplikacja działa bez internetu dzięki Service Worker i Cache API  

---

## Struktura projektu

/project-root
│
├─ index.html          # Strona główna
├─ offline.html        # Fallback offline
├─ styles.css          # Style aplikacji
├─ app.js              # Logika aplikacji
├─ sw.js               # Service Worker
├─ manifest.json       # PWA manifest
├─ favicon.ico         # Ikona aplikacji
└─ /icons
├─ icon-192.png
└─ icon-512.png

---

## Instalacja i uruchomienie lokalnie

1. Sklonuj repozytorium:  
```bash
git clone https://github.com/twoje-konto/mytasks.git

Uruchom lokalny serwer (np. VS Code Live Server lub npx serve):
npx serve .

Otwórz w przeglądarce:
http://localhost:3000


Progressive Web App
	•	Możesz dodać aplikację do ekranu głównego urządzenia (instalowalna jak natywna aplikacja)
	•	Offline support dzięki Service Worker
	•	Fallback przy braku połączenia: offline.html

⸻

Użyte natywne funkcje urządzenia
	1.	Geolokalizacja – pokazuje lokalizację użytkownika na podstawie współrzędnych GPS
	2.	Powiadomienia – informuje o nowych zadaniach i zmianach statusu

⸻

Responsywność
	•	Aplikacja działa na komputerach, tabletach i telefonach
	•	Layout dostosowany do różnych szerokości ekranów

⸻

Strategia buforowania
	•	Cache-first dla CSS, JS i ikon
	•	Fallback HTML dla dokumentów offline
	•	Kalendarz i lista zadań działają offline
