# eLicznik Tauron - Scraper Danych Energetycznych

🔋 Skrypt JavaScript do automatycznego pobierania danych z e-licznika Tauron w przeglądarce.

## Opis

Ten skrypt pozwala na automatyczne pobieranie historycznych danych o zużyciu i produkcji energii elektrycznej z platformy eLicznik Tauron. Skrypt działa w konsoli deweloperskiej przeglądarki i automatyzuje proces klikania i pobierania danych.

**Autor:** Łukasz Podgórski (kontakt@lukaszpodgorski.pl)  
**Repository:** [https://github.com/xshocuspocusxd/eLicznikTauron](https://github.com/xshocuspocusxd/eLicznikTauron)

## Funkcjonalności

✅ **Automatyczne pobieranie danych** - Skrypt automatycznie przełącza między zakładkami i pobiera dane  
✅ **Eksport do CSV** - Dane są formatowane jako CSV gotowy do użycia  
✅ **Obliczanie bilansu** - Automatyczne obliczanie bilansu energetycznego (energia oddana - energia pobrana)  
✅ **Aktualny bilans** - Możliwość sprawdzenia bieżącego bilansu energii  
✅ **Statystyki** - Wyświetlanie podsumowań i statystyk zebranych danych  
✅ **Kontrola procesu** - Możliwość zatrzymania pobierania w dowolnym momencie  
✅ **Obsługa błędów** - Zaawansowana obsługa błędów i ponawianie operacji  

## Instalacja i Użycie

### Krok 1: Przygotowanie
1. Otwórz przeglądarkę i przejdź na stronę: https://elicznik.tauron-dystrybucja.pl/odczyty
2. Zaloguj się do swojego konta eLicznik Tauron
3. Upewnij się, że znajdujesz się w sekcji "Odczyty"

### Krok 2: Uruchomienie skryptu
1. Otwórz konsolę deweloperską (F12 → Console/Konsola)
2. Skopiuj i wklej cały kod z pliku [`code.js`](code.js)
3. Naciśnij Enter aby uruchomić skrypt

### Krok 3: Pobieranie danych
Po uruchomieniu skryptu dostępne są następujące funkcje:

```javascript
// Pobierz dane z ostatnich 365 dni (domyślnie)
startDataCollection();

// Pobierz dane z ostatnich 30 dni
startDataCollection(30);

// Sprawdź aktualny bilans energii
getCurrentBalance();

// Zatrzymaj pobieranie danych
stopDataCollection();
```

## Przykłady Użycia

### Podstawowe pobieranie danych
```javascript
// Pobierz dane z ostatnich 7 dni
startDataCollection(7);
```

### Sprawdzenie aktualnego bilansu
```javascript
getCurrentBalance();
```
Wynik:
```
📈 Aktualny bilans energii:
📅 Data: 2024-01-15
⬇️  Energia pobrana: 25.4 kWh
⬆️  Energia oddana: 18.2 kWh
⚖️  Bilans: -7.2 kWh (deficyt)
```

### Zatrzymanie procesu
```javascript
stopDataCollection();
```

## Format Danych Wyjściowych

Skrypt generuje dane w formacie CSV z następującymi kolumnami:

```csv
data,energia_pobrana_kWh,energia_oddana_kWh,bilans_kWh
2024-01-15,25.40,18.20,-7.20
2024-01-14,22.10,19.80,-2.30
2024-01-13,20.50,25.10,4.60
```

### Opis kolumn:
- **data** - Data odczytu (RRRR-MM-DD)
- **energia_pobrana_kWh** - Ilość energii pobranej z sieci [kWh]
- **energia_oddana_kWh** - Ilość energii oddanej do sieci [kWh]  
- **bilans_kWh** - Bilans energetyczny (oddana - pobrana) [kWh]

## Statystyki

Po zakończeniu pobierania, skrypt automatycznie wyświetla statystyki:

```
📈 STATYSTYKI:
📊 Liczba dni z danymi: 30
⬇️  Łączna energia pobrana: 756.80 kWh
⬆️  Łączna energia oddana: 612.40 kWh
⚖️  Łączny bilans: -144.40 kWh (deficyt)
💰 Średni dzienny bilans: -4.81 kWh/dzień
```

## Konfiguracja

Możesz dostosować konfigurację skryptu modyfikując parametry w klasie `TauronEnergyDataCollector`:

```javascript
this.config = {
  switchDelay: 2000,        // Opóźnienie między przełączaniem zakładek (ms)
  retryDelay: 1000,         // Opóźnienie przy ponownej próbie (ms)
  maxRetries: 3             // Maksymalna liczba prób
};
```

## Rozwiązywanie Problemów

### Problem: Skrypt się zatrzymuje
**Rozwiązanie:** Sprawdź czy:
- Jesteś zalogowany na właściwej stronie
- Strona jest w pełni załadowana
- Konsola deweloperska jest otwarta

### Problem: Brak danych lub "Brak danych" w wynikach
**Rozwiązanie:**
- Zwiększ `switchDelay` w konfiguracji (wolniejsze połączenie)
- Sprawdź czy strona ładuje się poprawnie
- Zweryfikuj czy masz uprawnienia do przeglądania danych

### Problem: Błędy w konsoli
**Rozwiązanie:**
- Odśwież stronę i spróbuj ponownie
- Sprawdź czy struktura strony nie uległa zmianie
- Skontaktuj się z autorem jeśli problem się powtarza

## Ostrzeżenia i Ograniczenia

⚠️ **Ważne uwagi:**
- Skrypt działa tylko będąc zalogowanym na stronie eLicznik Tauron
- Pobieranie dużej ilości dni może zająć dużo czasu (każdy dzień = ~6 sekund)
- Nie należy zmieniać zakładek podczas działania skryptu
- Skrypt może przestać działać jeśli Tauron zmieni strukturę strony

## Zgodność z Przeglądarkami

✅ Chrome 80+  
✅ Firefox 75+  
✅ Edge 80+  
✅ Safari 13+  

## Licencja

Ten projekt jest dostępny na licencji MIT. Zobacz plik LICENSE dla więcej szczegółów.

## Kontakt

Jeśli masz pytania lub problemy:
- **Email:** admin@myeye.pl
- **GitHub:** [xshocuspocusxd](https://github.com/xshocuspocusxd)
- **Issues:** [GitHub Issues](https://github.com/xshocuspocusxd/eLicznikTauron/issues)

## Changelog

### v2.0.0 (2024)
- ✨ Kompletna refaktoryzacja kodu
- ✨ Dodana funkcja sprawdzania aktualnego bilansu
- ✨ Ulepszone zarządzanie błędami
- ✨ Dodane statystyki i progress tracking
- ✨ Lepsze formatowanie danych wyjściowych
- ✨ Możliwość zatrzymania procesu

### v1.0.0 (2024)
- 🎉 Pierwsza wersja skryptu
- 📊 Podstawowe pobieranie danych CSV
- 🔄 Automatyczne przełączanie między zakładkami

---

**⭐ Jeśli projekt Ci pomógł, zostaw gwiazdkę na GitHub!**