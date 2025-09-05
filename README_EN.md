# eLicznik Tauron - Energy Data Scraper

🔋 JavaScript script for automated energy data collection from Tauron eLicznik in browser console.

## Description

This script allows automatic collection of historical data about electricity consumption and production from the Tauron eLicznik platform. The script works in the browser's developer console and automates the process of clicking and data retrieval.

**Author:** Łukasz Podgórski (kontakt@lukaszpodgorski.pl)  
**Repository:** [https://github.com/xshocuspocusxd/eLicznikTauron](https://github.com/xshocuspocusxd/eLicznikTauron)

## Features

✅ **Automatic data collection** - Script automatically switches between tabs and collects data  
✅ **CSV export** - Data is formatted as ready-to-use CSV  
✅ **Balance calculation** - Automatic energy balance calculation (energy produced - energy consumed)  
✅ **Current balance** - Ability to check current energy balance  
✅ **Statistics** - Display summaries and statistics of collected data  
✅ **Process control** - Ability to stop data collection at any time  
✅ **Error handling** - Advanced error handling and retry operations  

## Installation and Usage

### Step 1: Preparation
1. Open your browser and go to: https://elicznik.tauron-dystrybucja.pl/odczyty
2. Log in to your Tauron eLicznik account
3. Make sure you are in the "Odczyty" (Readings) section

### Step 2: Running the script
1. Open developer console (F12 → Console)
2. Copy and paste the entire code from [`code.js`](code.js) file
3. Press Enter to run the script

### Step 3: Data collection
After running the script, the following functions are available:

```javascript
// Collect data from the last 365 days (default)
startDataCollection();

// Collect data from the last 30 days
startDataCollection(30);

// Check current energy balance
getCurrentBalance();

// Stop data collection
stopDataCollection();
```

## Usage Examples

### Basic data collection
```javascript
// Collect data from the last 7 days
startDataCollection(7);
```

### Check current balance
```javascript
getCurrentBalance();
```
Result:
```
📈 Current energy balance:
📅 Date: 2024-01-15
⬇️  Energy consumed: 25.4 kWh
⬆️  Energy produced: 18.2 kWh
⚖️  Balance: -7.2 kWh (deficit)
```

### Stop the process
```javascript
stopDataCollection();
```

## Output Data Format

The script generates data in CSV format with the following columns:

```csv
data,energia_pobrana_kWh,energia_oddana_kWh,bilans_kWh
2024-01-15,25.40,18.20,-7.20
2024-01-14,22.10,19.80,-2.30
2024-01-13,20.50,25.10,4.60
```

### Column descriptions:
- **data** - Reading date (YYYY-MM-DD)
- **energia_pobrana_kWh** - Amount of energy consumed from grid [kWh]
- **energia_oddana_kWh** - Amount of energy produced to grid [kWh]  
- **bilans_kWh** - Energy balance (produced - consumed) [kWh]

## Statistics

After data collection completion, the script automatically displays statistics:

```
📈 STATISTICS:
📊 Number of days with data: 30
⬇️  Total energy consumed: 756.80 kWh
⬆️  Total energy produced: 612.40 kWh
⚖️  Total balance: -144.40 kWh (deficit)
💰 Average daily balance: -4.81 kWh/day
```

## Configuration

You can customize script configuration by modifying parameters in the `TauronEnergyDataCollector` class:

```javascript
this.config = {
  switchDelay: 2000,        // Delay between tab switching (ms)
  retryDelay: 1000,         // Delay for retry attempts (ms)
  maxRetries: 3             // Maximum number of retries
};
```

## Troubleshooting

### Issue: Script stops working
**Solution:** Check if:
- You are logged in on the correct page
- Page is fully loaded
- Developer console is open

### Issue: No data or "No data" in results
**Solution:**
- Increase `switchDelay` in configuration (slower connection)
- Check if page loads correctly
- Verify you have permissions to view the data

### Issue: Console errors
**Solution:**
- Refresh the page and try again
- Check if page structure has changed
- Contact the author if problem persists

## Warnings and Limitations

⚠️ **Important notes:**
- Script only works when logged in to Tauron eLicznik page
- Collecting large amounts of days may take a long time (each day = ~6 seconds)
- Do not change tabs while script is running
- Script may stop working if Tauron changes page structure

## Browser Compatibility

✅ Chrome 80+  
✅ Firefox 75+  
✅ Edge 80+  
✅ Safari 13+  

## License

This project is available under the MIT License. See LICENSE file for more details.

## Contact

If you have questions or problems:
- **Email:** admin@myeye.pl
- **GitHub:** [xshocuspocusxd](https://github.com/xshocuspocusxd)
- **Issues:** [GitHub Issues](https://github.com/xshocuspocusxd/eLicznikTauron/issues)

## Changelog

### v2.0.0 (2024)
- ✨ Complete code refactoring
- ✨ Added current balance checking function
- ✨ Improved error handling
- ✨ Added statistics and progress tracking
- ✨ Better output data formatting
- ✨ Ability to stop the process

### v1.0.0 (2024)
- 🎉 First version of the script
- 📊 Basic CSV data collection
- 🔄 Automatic tab switching

---

**⭐ If this project helped you, please star it on GitHub!**