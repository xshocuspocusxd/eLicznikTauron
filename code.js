/**
 * eLicznik Tauron - Energy Data Scraper
 * Author: Łukasz Podgórski (kontakt@lukaszpodgorski.pl)
 * Repository: https://github.com/xshocuspocusxd/eLicznikTauron
 * 
 * Skrypt do pobierania danych z e-licznika Tauron
 * Uruchom w konsoli deweloperskiej na stronie: https://elicznik.tauron-dystrybucja.pl/odczyty
 * 
 * Użycie:
 * - startDataCollection(365) - pobiera dane z ostatnich 365 dni
 * - getCurrentBalance() - wyświetla aktualny bilans energii
 * - stopDataCollection() - zatrzymuje pobieranie danych
 */

class TauronEnergyDataCollector {
  constructor() {
    this.csvData = "data,energia_pobrana_kWh,energia_oddana_kWh,bilans_kWh\n";
    this.isRunning = false;
    this.totalDays = 0;
    this.processedDays = 0;
    this.config = {
      switchDelay: 2000,        // Opóźnienie między przełączaniem zakładek (ms)
      retryDelay: 1000,         // Opóźnienie przy ponownej próbie (ms)
      maxRetries: 3             // Maksymalna liczba prób
    };
  }

  /**
   * Rozpoczyna pobieranie danych energetycznych
   * @param {number} dayCount - Liczba dni do pobrania (licząc wstecz)
   */
  startDataCollection(dayCount = 365) {
    if (this.isRunning) {
      console.warn("⚠️  Pobieranie już trwa. Użyj stopDataCollection() aby zatrzymać.");
      return;
    }

    console.log(`🚀 Rozpoczynam pobieranie danych za ostatnie ${dayCount} dni...`);
    this.isRunning = true;
    this.totalDays = dayCount;
    this.processedDays = 0;
    this.csvData = "data,energia_pobrana_kWh,energia_oddana_kWh,bilans_kWh\n";
    
    this._fetchDayData(dayCount);
  }

  /**
   * Zatrzymuje pobieranie danych
   */
  stopDataCollection() {
    this.isRunning = false;
    console.log("🛑 Pobieranie danych zostało zatrzymane.");
    this._displayResults();
  }

  /**
   * Pobiera i wyświetla aktualny bilans energii
   */
  getCurrentBalance() {
    console.log("📊 Pobieranie aktualnego bilansu energii...");
    
    this._switchToEnergyTab("oddana", () => {
      setTimeout(() => {
        this._switchToEnergyTab("pobrana", () => {
          setTimeout(() => {
            const data = this._extractCurrentData();
            if (data.isValid) {
              const balance = this._calculateBalance(data.consumed, data.produced);
              console.log(`📈 Aktualny bilans energii:`);
              console.log(`📅 Data: ${data.date}`);
              console.log(`⬇️  Energia pobrana: ${data.consumed} kWh`);
              console.log(`⬆️  Energia oddana: ${data.produced} kWh`);
              console.log(`⚖️  Bilans: ${balance} kWh ${balance >= 0 ? '(nadwyżka)' : '(deficyt)'}`);
            } else {
              console.error("❌ Nie udało się pobrać aktualnych danych bilansu.");
            }
          }, this.config.switchDelay);
        });
      }, this.config.switchDelay);
    });
  }

  /**
   * Pobiera dane dla określonej liczby dni (rekurencyjnie)
   * @private
   */
  _fetchDayData(remainingDays) {
    if (!this.isRunning || remainingDays <= 0) {
      this._displayResults();
      return;
    }

    this._fetchSingleDay(() => {
      this.processedDays++;
      this._updateProgress();
      
      // Przejdź do poprzedniego dnia
      this._goToPreviousDay();
      
      // Kontynuuj z następnym dniem
      setTimeout(() => {
        this._fetchDayData(remainingDays - 1);
      }, this.config.switchDelay);
    });
  }

  /**
   * Pobiera dane dla pojedynczego dnia
   * @private
   */
  _fetchSingleDay(callback) {
    this._switchToEnergyTab("oddana", () => {
      setTimeout(() => {
        this._switchToEnergyTab("pobrana", () => {
          setTimeout(() => {
            const data = this._extractCurrentData();
            this._saveDataToCSV(data);
            callback();
          }, this.config.switchDelay);
        });
      }, this.config.switchDelay);
    });
  }

  /**
   * Przełącza na zakładkę energii
   * @private
   */
  _switchToEnergyTab(type, callback) {
    try {
      const tab = document.querySelector(`a[href="#energia-${type}"]`);
      if (tab) {
        tab.click();
        callback();
      } else {
        console.error(`❌ Nie znaleziono zakładki energia-${type}`);
        callback();
      }
    } catch (error) {
      console.error(`❌ Błąd przy przełączaniu zakładki: ${error.message}`);
      callback();
    }
  }

  /**
   * Przechodzi do poprzedniego dnia
   * @private
   */
  _goToPreviousDay() {
    try {
      const prevButton = document.querySelector('button.duration__button.prev');
      if (prevButton) {
        prevButton.click();
      } else {
        console.error("❌ Nie znaleziono przycisku poprzedniego dnia");
      }
    } catch (error) {
      console.error(`❌ Błąd przy przechodzeniu do poprzedniego dnia: ${error.message}`);
    }
  }

  /**
   * Wydobywa dane z aktualnie wyświetlanej strony
   * @private
   */
  _extractCurrentData() {
    try {
      const values = document.querySelectorAll('h1.big.blue.hightlight');
      const dateInput = document.querySelector('input[id="duration_date"]');
      
      const data = {
        date: dateInput ? dateInput.value : 'Nie znaleziono',
        consumed: 0,
        produced: 0,
        isValid: false
      };

      if (values.length >= 2 && dateInput) {
        const consumedText = values[0].textContent.trim();
        const producedText = values[1].textContent.trim();
        
        // Sprawdź czy wartości są różne (unikaj błędnych odczytów)
        if (consumedText !== producedText) {
          data.consumed = this._parseEnergyValue(consumedText);
          data.produced = this._parseEnergyValue(producedText);
          data.isValid = true;
        }
      }

      return data;
    } catch (error) {
      console.error(`❌ Błąd przy wydobywaniu danych: ${error.message}`);
      return { date: 'Błąd', consumed: 0, produced: 0, isValid: false };
    }
  }

  /**
   * Parsuje wartość energii z tekstu
   * @private
   */
  _parseEnergyValue(text) {
    const numericValue = parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'));
    return isNaN(numericValue) ? 0 : numericValue;
  }

  /**
   * Oblicza bilans energetyczny
   * @private
   */
  _calculateBalance(consumed, produced) {
    return Math.round((produced - consumed) * 100) / 100;
  }

  /**
   * Zapisuje dane do CSV
   * @private
   */
  _saveDataToCSV(data) {
    if (data.isValid) {
      const balance = this._calculateBalance(data.consumed, data.produced);
      this.csvData += `${data.date},${data.consumed},${data.produced},${balance}\n`;
    } else {
      this.csvData += `${data.date},Brak danych,Brak danych,Brak danych\n`;
    }
  }

  /**
   * Aktualizuje progress w konsoli
   * @private
   */
  _updateProgress() {
    const percentage = Math.round((this.processedDays / this.totalDays) * 100);
    console.log(`📊 Postęp: ${this.processedDays}/${this.totalDays} dni (${percentage}%)`);
  }

  /**
   * Wyświetla finalne rezultaty
   * @private
   */
  _displayResults() {
    this.isRunning = false;
    console.log("✅ Pobieranie danych zakończone!");
    console.log("📋 Dane CSV:");
    console.log(this.csvData);
    console.log("💾 Skopiuj powyższe dane i zapisz w pliku .csv");
    
    // Oblicz statystyki
    this._displayStatistics();
  }

  /**
   * Wyświetla statystyki zebranych danych
   * @private
   */
  _displayStatistics() {
    const lines = this.csvData.split('\n').slice(1).filter(line => line.trim());
    const validData = lines.filter(line => !line.includes('Brak danych'));
    
    if (validData.length > 0) {
      let totalConsumed = 0;
      let totalProduced = 0;
      
      validData.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 4) {
          totalConsumed += parseFloat(parts[1]) || 0;
          totalProduced += parseFloat(parts[2]) || 0;
        }
      });
      
      const totalBalance = this._calculateBalance(totalConsumed, totalProduced);
      
      console.log("\n📈 STATYSTYKI:");
      console.log(`📊 Liczba dni z danymi: ${validData.length}`);
      console.log(`⬇️  Łączna energia pobrana: ${totalConsumed.toFixed(2)} kWh`);
      console.log(`⬆️  Łączna energia oddana: ${totalProduced.toFixed(2)} kWh`);
      console.log(`⚖️  Łączny bilans: ${totalBalance} kWh ${totalBalance >= 0 ? '(nadwyżka)' : '(deficyt)'}`);
      console.log(`💰 Średni dzienny bilans: ${(totalBalance / validData.length).toFixed(2)} kWh/dzień`);
    }
  }
}

// Globalna instancja kolektora
const tauronCollector = new TauronEnergyDataCollector();

// Funkcje pomocnicze dla łatwego użycia
function startDataCollection(days = 365) {
  tauronCollector.startDataCollection(days);
}

function stopDataCollection() {
  tauronCollector.stopDataCollection();
}

function getCurrentBalance() {
  tauronCollector.getCurrentBalance();
}

// Wyświetl instrukcje użycia
console.log(`
🔋 eLicznik Tauron - Energy Data Scraper
========================================

Dostępne funkcje:
📥 startDataCollection(dni) - pobiera dane (domyślnie 365 dni)
📊 getCurrentBalance()      - wyświetla aktualny bilans
🛑 stopDataCollection()     - zatrzymuje pobieranie

Przykłady użycia:
startDataCollection(30)     - pobierz ostatnie 30 dni
getCurrentBalance()         - pokaż aktualny bilans
stopDataCollection()        - zatrzymaj pobieranie

🚀 Aby rozpocząć, wywołaj: startDataCollection()
`);

// Kompatybilność z poprzednią wersją
function fetchData(days) {
  console.warn("⚠️  fetchData() jest przestarzałe. Użyj startDataCollection() zamiast tego.");
  startDataCollection(days);
}
