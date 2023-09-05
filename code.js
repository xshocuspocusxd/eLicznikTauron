// 2023.09.05
// Łukasz Podgórski admin@myeye.pl 
// https://github.com/xshocuspocusxd/eLicznikTauron
// Kod uruchamiamy z konsoli developerskiej będąc na stronie: https://elicznik.tauron-dystrybucja.pl/odczyty
// 
// Zmienna do przechowywania danych w formie CSV
let csvData = "data,energia pobrana,energia oddana\n";  // Nagłówek

// Funkcja do pobierania danych
function fetchData(dayCount) {
  if (dayCount <= 0) {
    // Wyświetl zebrane dane CSV, gdy zakończysz
    console.log(csvData);
    return;
  }

  function fetchDataInternal() {
    // Kliknij na zakładkę "Energia oddana"
    document.querySelector('a[href="#energia-oddana"]').click();

    // Poczekaj 2 sekundy
    setTimeout(() => {
      // Kliknij na zakładkę "Energia pobrana"
      document.querySelector('a[href="#energia-pobrana"]').click();

      // Poczekaj kolejne 2 sekundy
      setTimeout(() => {
        // Pobierz wszystkie wartości
        const values = document.querySelectorAll('h1.big.blue.hightlight');
        const data = document.querySelector('input[id="duration_date"]').value;

        // Sprawdzam, czy obie wartości są dostępne
        if (values.length >= 2 && data) {
          const pobrana = values[0].textContent;
          const oddana = values[1].textContent;
          
          if (pobrana === oddana) {
            // Jeżeli wartości są takie same, próbujemy ponownie
            fetchDataInternal();
            return;
          }
          
          // Dodajemy nową linię do danych CSV
          csvData += `${data},${pobrana},${oddana}\n`;
        } else {
          csvData += `${data || 'Nie znaleziono'},${'Brak danych'},${'Brak danych'}\n`;
        }

        // Kliknij przycisk "prev" aby cofnąć się o jeden dzień
        document.querySelector('button.duration__button.prev').click();

        // Wywołaj tę funkcję rekurencyjnie z mniejszą liczbą dni
        fetchData(dayCount - 1);
      }, 2000);
    }, 2000);
  }

  fetchDataInternal();
}

// Rozpocznij pobieranie danych dla ostatnich 365 dni
fetchData(365);