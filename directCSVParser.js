/**
 * Direct CSV Parser for Brand Health KPI Dashboard
 * This script demonstrates how to directly parse the CSV file instead of using hardcoded values.
 * It can be used as a starting point for updating the code to directly parse the CSV file.
 */

/**
 * Parse CSV data directly from the file
 * @param {string} filePath - The path to the CSV file
 * @returns {Promise<Object>} - A promise that resolves to the parsed data object
 */
function parseCSVFromFile(filePath) {
  return new Promise((resolve, reject) => {
    fetch(filePath)
      .then(response => response.text())
      .then(csvText => {
        const data = parseCSVData(csvText);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * Parse CSV data and extract brand health metrics
 * @param {string} csvText - The CSV data as a string
 * @returns {Object} - Object containing parsed data
 */
function parseCSVData(csvText) {
  console.log('Parsing CSV data directly...');
  
  // Split the CSV data into lines
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  // Extract the header row
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Find the column indices for the metrics and comparisons
  const q1_2025_index = headers.indexOf('Q1 2025');
  const vs_target_index = headers.indexOf('Q1\'25 VS Target');
  const vs_q4_index = headers.indexOf('Q1\'25 vs Q4\'24');
  const vs_q1_ly_index = headers.indexOf('Q1\'25 vs Q1\'24');
  
  // Initialize the data object
  const data = {
    overall: {
      awareness: { value: 0, vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 },
      familiarity: { value: 0, vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 },
      consideration: { value: 0, vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 },
      intent: { value: 0, vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 }
    },
    markets: {},
    quarterlyData: [],
    comparisons: {
      awareness: { vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 },
      familiarity: { vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 },
      consideration: { vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 },
      intent: { vsTarget: 0, vsQ4: 0, vsQ1LastYear: 0 }
    },
    latestData: {},
    atRiskMarkets: []
  };
  
  // Process each line
  let currentMetric = '';
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].split(',').map(value => value.trim());
    const market = line[0];
    
    // Skip empty lines
    if (!market || market === '') continue;
    
    // Check if this is a metric header (Awareness, Familiarity, etc.)
    if (['Awareness', 'Familiarity', 'Consideration', 'Intent'].includes(market)) {
      currentMetric = market.toLowerCase();
      
      // Extract overall metric values
      data.overall[currentMetric].value = parsePercentage(line[q1_2025_index]);
      data.overall[currentMetric].vsTarget = parsePercentage(line[vs_target_index]);
      data.overall[currentMetric].vsQ4 = parsePercentage(line[vs_q4_index]);
      data.overall[currentMetric].vsQ1LastYear = parsePercentage(line[vs_q1_ly_index]);
      
      // Update comparisons
      data.comparisons[currentMetric].vsTarget = parsePercentage(line[vs_target_index]);
      data.comparisons[currentMetric].vsQ4 = parsePercentage(line[vs_q4_index]);
      data.comparisons[currentMetric].vsQ1LastYear = parsePercentage(line[vs_q1_ly_index]);
    } else if (currentMetric && market !== '') {
      // This is a market row for the current metric
      
      // Initialize market data if it doesn't exist
      if (!data.markets[market]) {
        data.markets[market] = {};
        data.latestData[market] = {};
      }
      
      // Extract market metric values
      const value = parsePercentage(line[q1_2025_index]);
      const vsTarget = parsePercentage(line[vs_target_index]);
      const vsQ4 = parsePercentage(line[vs_q4_index]);
      const vsQ1LastYear = parsePercentage(line[vs_q1_ly_index]);
      
      // Calculate target value
      const targetValue = value - vsTarget;
      
      // Update market data
      data.markets[market][currentMetric] = value + '%';
      data.markets[market][currentMetric + 'Target'] = targetValue.toFixed(1) + '%';
      data.markets[market][currentMetric + 'VsTarget'] = vsTarget;
      data.markets[market][currentMetric + 'VsQ4'] = vsQ4;
      data.markets[market][currentMetric + 'VsQ1LastYear'] = vsQ1LastYear;
      data.markets[market][currentMetric + 'Growth'] = vsQ1LastYear;
      
      // Update latest data
      data.latestData[market][currentMetric] = value;
      
      // Check if this market is at risk
      if (vsTarget < 0 || vsQ1LastYear < 0) {
        let issue = '';
        
        if (vsTarget < 0) {
          issue = 'Below Target';
        } else if (vsQ1LastYear < 0) {
          issue = 'YoY Decline (' + vsQ1LastYear + '%)';
        }
        
        // Add to at-risk markets
        data.atRiskMarkets.push({
          market,
          metric: currentMetric,
          value,
          target: targetValue,
          vsTarget,
          issue
        });
      }
    }
  }
  
  // Extract quarterly data
  const quarterlyColumns = headers.filter(header => header.startsWith('Q'));
  const quarterlyData = [];
  
  for (let i = 0; i < quarterlyColumns.length; i++) {
    const quarter = quarterlyColumns[i];
    const quarterIndex = headers.indexOf(quarter);
    
    if (quarterIndex !== -1) {
      const quarterData = {
        quarter,
        awareness: 0,
        familiarity: 0,
        consideration: 0,
        intent: 0
      };
      
      // Find the values for each metric
      for (let j = 1; j < lines.length; j++) {
        const line = lines[j].split(',').map(value => value.trim());
        const market = line[0];
        
        if (market === 'Awareness') {
          quarterData.awareness = parsePercentage(line[quarterIndex]);
        } else if (market === 'Familiarity') {
          quarterData.familiarity = parsePercentage(line[quarterIndex]);
        } else if (market === 'Consideration') {
          quarterData.consideration = parsePercentage(line[quarterIndex]);
        } else if (market === 'Intent') {
          quarterData.intent = parsePercentage(line[quarterIndex]);
        }
      }
      
      quarterlyData.push(quarterData);
    }
  }
  
  // Sort quarterly data by quarter
  quarterlyData.sort((a, b) => {
    const aYear = parseInt(a.quarter.split(' ')[1]);
    const bYear = parseInt(b.quarter.split(' ')[1]);
    
    if (aYear !== bYear) {
      return aYear - bYear;
    }
    
    const aQuarter = parseInt(a.quarter.split(' ')[0].substring(1));
    const bQuarter = parseInt(b.quarter.split(' ')[0].substring(1));
    
    return aQuarter - bQuarter;
  });
  
  data.quarterlyData = quarterlyData;
  
  // Extract projections
  const projectionYears = headers.filter(header => /^\d{4}$/.test(header));
  const projections = {
    years: projectionYears,
    awareness: [],
    familiarity: [],
    consideration: [],
    intent: []
  };
  
  for (let i = 0; i < projectionYears.length; i++) {
    const year = projectionYears[i];
    const yearIndex = headers.indexOf(year);
    
    if (yearIndex !== -1) {
      // Find the values for each metric
      for (let j = 1; j < lines.length; j++) {
        const line = lines[j].split(',').map(value => value.trim());
        const market = line[0];
        
        if (market === 'Awareness') {
          projections.awareness.push(parsePercentage(line[yearIndex]));
        } else if (market === 'Familiarity') {
          projections.familiarity.push(parsePercentage(line[yearIndex]));
        } else if (market === 'Consideration') {
          projections.consideration.push(parsePercentage(line[yearIndex]));
        } else if (market === 'Intent') {
          projections.intent.push(parsePercentage(line[yearIndex]));
        }
      }
    }
  }
  
  data.projections = projections;
  
  console.log('CSV data parsed successfully');
  return data;
}

/**
 * Helper function to parse percentage values
 * @param {string} value - The percentage value as a string
 * @returns {number} - The parsed percentage value as a number
 */
function parsePercentage(value) {
  if (!value || value === '-') return 0;
  return parseFloat(value.replace('%', ''));
}

/**
 * Example usage
 */
function exampleUsage() {
  // Parse the CSV file directly
  parseCSVFromFile('../Files/March/march-brand-health-t1.csv')
    .then(data => {
      console.log('Parsed data:', data);
      
      // Store the data in a global variable for charts to use
      window.brandHealthData = data;
      
      // Populate the metric cards
      populateMetricCards(data);
      
      // Initialize the market comparison table
      initializeMarketComparisonTable();
      
      // Initialize the market heatmap
      initializeMarketHeatmap();
      
      // Initialize visible charts
      setTimeout(initializeVisibleCharts, 500);
    })
    .catch(error => {
      console.error('Error parsing CSV file:', error);
    });
}

/**
 * Test the direct CSV parser
 */
function testDirectCSVParser() {
  const resultContainer = document.getElementById('csv-parser-result');
  if (!resultContainer) return;
  
  resultContainer.innerHTML = '<div class="loading"></div><p>Testing direct CSV parser...</p>';
  
  parseCSVFromFile('../Files/March/march-brand-health-t1.csv')
    .then(data => {
      // Display the results
      resultContainer.innerHTML = '';
      
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = '<h3>CSV Parsed Successfully</h3><p>The CSV file was successfully parsed directly. Below is a sample of the parsed data:</p>';
      
      const dataPreview = document.createElement('div');
      dataPreview.className = 'code-block';
      
      const preElement = document.createElement('pre');
      preElement.textContent = JSON.stringify({
        overall: data.overall,
        markets: {
          'US': data.markets['US'],
          'China': data.markets['China']
        },
        latestData: {
          'US': data.latestData['US'],
          'China': data.latestData['China']
        }
      }, null, 2);
      
      dataPreview.appendChild(preElement);
      
      const recommendation = document.createElement('div');
      recommendation.className = 'info-message';
      recommendation.innerHTML = `
        <h3>Implementation Recommendation</h3>
        <p>To implement direct CSV parsing in the dashboard:</p>
        <ol>
          <li>Replace the <code>loadCSVData()</code> function in <code>Brand Health.js</code> with the <code>parseCSVFromFile()</code> function from this script.</li>
          <li>Replace the <code>parseCSVData()</code> function in <code>populateMetricCards.js</code> with the one from this script.</li>
          <li>Update any references to the data structure as needed.</li>
        </ol>
        <p>This will ensure that the dashboard always uses the latest data from the CSV file.</p>
      `;
      
      resultContainer.appendChild(successMessage);
      resultContainer.appendChild(dataPreview);
      resultContainer.appendChild(recommendation);
    })
    .catch(error => {
      resultContainer.innerHTML = '';
      
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.innerHTML = `<h3>Error Parsing CSV</h3><p>${error.message}</p>`;
      
      resultContainer.appendChild(errorMessage);
    });
}

// Add event listener for the test button
document.addEventListener('DOMContentLoaded', function() {
  const testButton = document.getElementById('test-csv-parser');
  if (testButton) {
    testButton.addEventListener('click', testDirectCSVParser);
  }
});
