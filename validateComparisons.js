/**
 * Validation script for Brand Health KPI Dashboard
 * Validates the "vs target" comparisons in the CSV data against the hardcoded values in the code
 */

// Function to parse the CSV data
function parseCSVForValidation(csvString) {
  const lines = csvString.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Find the column indices for the metrics and comparisons
  const q1_2025_index = headers.indexOf('Q1 2025');
  const vs_target_index = headers.indexOf('Q1\'25 VS Target');
  const vs_q4_index = headers.indexOf('Q1\'25 vs Q4\'24');
  const vs_q1_ly_index = headers.indexOf('Q1\'25 vs Q1\'24');
  
  // Initialize the result object
  const result = {
    metrics: {},
    markets: {}
  };
  
  // Process each line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].split(',').map(value => value.trim());
    const market = line[0];
    
    // Skip empty lines or section headers
    if (!market || market === '') continue;
    
    // Check if this is a metric header (Awareness, Familiarity, etc.)
    if (['Awareness', 'Familiarity', 'Consideration', 'Intent'].includes(market)) {
      const metricKey = market.toLowerCase();
      result.metrics[metricKey] = {
        value: parsePercentage(line[q1_2025_index]),
        vsTarget: parsePercentage(line[vs_target_index]),
        vsQ4: parsePercentage(line[vs_q4_index]),
        vsQ1LastYear: parsePercentage(line[vs_q1_ly_index])
      };
    } else {
      // This is a market row
      if (!result.markets[market]) {
        result.markets[market] = {};
      }
      
      // Determine which metric this market row belongs to
      let currentMetric = '';
      for (let j = i - 1; j >= 1; j--) {
        const prevMarket = lines[j].split(',')[0].trim();
        if (['Awareness', 'Familiarity', 'Consideration', 'Intent'].includes(prevMarket)) {
          currentMetric = prevMarket.toLowerCase();
          break;
        }
      }
      
      if (currentMetric) {
        result.markets[market][currentMetric] = {
          value: parsePercentage(line[q1_2025_index]),
          vsTarget: parsePercentage(line[vs_target_index]),
          vsQ4: parsePercentage(line[vs_q4_index]),
          vsQ1LastYear: parsePercentage(line[vs_q1_ly_index])
        };
      }
    }
  }
  
  return result;
}

// Helper function to parse percentage values
function parsePercentage(value) {
  if (!value || value === '-') return null;
  return parseFloat(value.replace('%', ''));
}

// Function to validate the comparisons
function validateComparisons(csvData, codeData) {
  console.log('Validating comparisons...');
  
  const discrepancies = {
    overall: [],
    markets: {}
  };
  
  // Validate overall metrics
  for (const metric of ['awareness', 'familiarity', 'consideration', 'intent']) {
    const csvMetric = csvData.metrics[metric];
    const codeMetric = codeData.overall[metric];
    
    if (csvMetric && codeMetric) {
      // Validate vs target
      if (csvMetric.vsTarget !== codeMetric.vsTarget) {
        discrepancies.overall.push({
          metric,
          comparison: 'vsTarget',
          csvValue: csvMetric.vsTarget,
          codeValue: codeMetric.vsTarget,
          difference: Math.abs(csvMetric.vsTarget - codeMetric.vsTarget)
        });
      }
      
      // Validate vs Q4
      if (csvMetric.vsQ4 !== codeMetric.vsQ4) {
        discrepancies.overall.push({
          metric,
          comparison: 'vsQ4',
          csvValue: csvMetric.vsQ4,
          codeValue: codeMetric.vsQ4,
          difference: Math.abs(csvMetric.vsQ4 - codeMetric.vsQ4)
        });
      }
      
      // Validate vs Q1 last year
      if (csvMetric.vsQ1LastYear !== codeMetric.vsQ1LastYear) {
        discrepancies.overall.push({
          metric,
          comparison: 'vsQ1LastYear',
          csvValue: csvMetric.vsQ1LastYear,
          codeValue: codeMetric.vsQ1LastYear,
          difference: Math.abs(csvMetric.vsQ1LastYear - codeMetric.vsQ1LastYear)
        });
      }
    }
  }
  
  // Validate market metrics
  for (const market in csvData.markets) {
    if (codeData.markets[market]) {
      discrepancies.markets[market] = [];
      
      for (const metric of ['awareness', 'familiarity', 'consideration', 'intent']) {
        const csvMarketMetric = csvData.markets[market][metric];
        const codeMarketMetric = {
          value: parseFloat(codeData.markets[market][metric]?.replace('%', '') || 0),
          vsTarget: codeData.markets[market][`${metric}VsTarget`],
          vsQ4: codeData.markets[market][`${metric}VsQ4`],
          vsQ1LastYear: codeData.markets[market][`${metric}VsQ1LastYear`]
        };
        
        // Check if the current value matches
        if (csvMarketMetric && Math.abs(csvMarketMetric.value - codeMarketMetric.value) > 0.1) {
          discrepancies.markets[market].push({
            metric,
            comparison: 'value',
            csvValue: csvMarketMetric.value,
            codeValue: codeMarketMetric.value,
            difference: Math.abs(csvMarketMetric.value - codeMarketMetric.value)
          });
        }
        
        // Check if vs target matches
        if (csvMarketMetric && Math.abs(csvMarketMetric.vsTarget - codeMarketMetric.vsTarget) > 0.1) {
          discrepancies.markets[market].push({
            metric,
            comparison: 'vsTarget',
            csvValue: csvMarketMetric.vsTarget,
            codeValue: codeMarketMetric.vsTarget,
            difference: Math.abs(csvMarketMetric.vsTarget - codeMarketMetric.vsTarget)
          });
        }
        
        // Check if vs Q4 matches
        if (csvMarketMetric && Math.abs(csvMarketMetric.vsQ4 - codeMarketMetric.vsQ4) > 0.1) {
          discrepancies.markets[market].push({
            metric,
            comparison: 'vsQ4',
            csvValue: csvMarketMetric.vsQ4,
            codeValue: codeMarketMetric.vsQ4,
            difference: Math.abs(csvMarketMetric.vsQ4 - codeMarketMetric.vsQ4)
          });
        }
        
        // Check if vs Q1 last year matches
        if (csvMarketMetric && Math.abs(csvMarketMetric.vsQ1LastYear - codeMarketMetric.vsQ1LastYear) > 0.1) {
          discrepancies.markets[market].push({
            metric,
            comparison: 'vsQ1LastYear',
            csvValue: csvMarketMetric.vsQ1LastYear,
            codeValue: codeMarketMetric.vsQ1LastYear,
            difference: Math.abs(csvMarketMetric.vsQ1LastYear - codeMarketMetric.vsQ1LastYear)
          });
        }
        
        // Validate the calculation (current value - target value = vs target)
        if (csvMarketMetric) {
          const targetValue = codeMarketMetric.value - codeMarketMetric.vsTarget;
          const calculatedVsTarget = csvMarketMetric.value - targetValue;
          
          if (Math.abs(calculatedVsTarget - csvMarketMetric.vsTarget) > 0.1) {
            discrepancies.markets[market].push({
              metric,
              comparison: 'calculation',
              csvValue: csvMarketMetric.vsTarget,
              calculatedValue: calculatedVsTarget,
              difference: Math.abs(calculatedVsTarget - csvMarketMetric.vsTarget),
              note: `Target value: ${targetValue}, Current value: ${csvMarketMetric.value}`
            });
          }
        }
      }
      
      // Remove empty market entries
      if (discrepancies.markets[market].length === 0) {
        delete discrepancies.markets[market];
      }
    }
  }
  
  return discrepancies;
}

// Function to load the CSV data
function loadCSVData() {
  return new Promise((resolve, reject) => {
    fetch('../Files/March/march-brand-health-t1.csv')
      .then(response => response.text())
      .then(csvText => {
        resolve(csvText);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Function to get the hardcoded data from the code
function getCodeData() {
  // This is a simplified version of the parseCSVData function from populateMetricCards.js
  return {
    overall: {
      awareness: { value: 84.4, vsTarget: 0.5, vsQ4: 0.9, vsQ1LastYear: 1.9 },
      familiarity: { value: 55.2, vsTarget: 1.0, vsQ4: 1.4, vsQ1LastYear: 15.8 },
      consideration: { value: 44.7, vsTarget: 1.0, vsQ4: 1.5, vsQ1LastYear: 1.5 },
      intent: { value: 27.8, vsTarget: 0.5, vsQ4: 1.0, vsQ1LastYear: 1.4 }
    },
    markets: {
      'UK': { 
        awareness: '93.1%', familiarity: '44.4%', consideration: '34.8%', intent: '23.4%',
        awarenessTarget: '92.8%', familiarityTarget: '42.2%', considerationTarget: '33.6%', intentTarget: '22.4%',
        awarenessVsTarget: 0.3, familiarityVsTarget: 2.2, considerationVsTarget: 1.2, intentVsTarget: 1.0,
        awarenessVsQ4: 0.4, familiarityVsQ4: 2.6, considerationVsQ4: 1.7, intentVsQ4: 1.3,
        awarenessVsQ1LastYear: 1.3, familiarityVsQ1LastYear: 11.4, considerationVsQ1LastYear: 3.3, intentVsQ1LastYear: 3.9
      },
      'Germany': { 
        awareness: '87.5%', familiarity: '51.2%', consideration: '39.4%', intent: '23.3%',
        awarenessTarget: '86.2%', familiarityTarget: '49.9%', considerationTarget: '39.3%', intentTarget: '23.3%',
        awarenessVsTarget: 1.3, familiarityVsTarget: 1.3, considerationVsTarget: 0.1, intentVsTarget: 0.0,
        awarenessVsQ4: 1.8, familiarityVsQ4: 1.7, considerationVsQ4: 0.5, intentVsQ4: 0.8,
        awarenessVsQ1LastYear: 2.7, familiarityVsQ1LastYear: 17.6, considerationVsQ1LastYear: 0.1, intentVsQ1LastYear: -0.9
      },
      'US': { 
        awareness: '79.5%', familiarity: '44.0%', consideration: '41.3%', intent: '11.2%',
        awarenessTarget: '78.1%', familiarityTarget: '40.7%', considerationTarget: '40.0%', intentTarget: '10.5%',
        awarenessVsTarget: 1.4, familiarityVsTarget: 3.3, considerationVsTarget: 1.3, intentVsTarget: 0.7,
        awarenessVsQ4: 1.9, familiarityVsQ4: 3.8, considerationVsQ4: 1.9, intentVsQ4: 1.0,
        awarenessVsQ1LastYear: 2.7, familiarityVsQ1LastYear: 11.9, considerationVsQ1LastYear: 2.5, intentVsQ1LastYear: 2.7
      },
      'India': { 
        awareness: '95.2%', familiarity: '74.4%', consideration: '76.0%', intent: '64.9%',
        awarenessTarget: '94.5%', familiarityTarget: '73.9%', considerationTarget: '74.5%', intentTarget: '64.7%',
        awarenessVsTarget: 0.7, familiarityVsTarget: 0.5, considerationVsTarget: 1.5, intentVsTarget: 0.2,
        awarenessVsQ4: 0.7, familiarityVsQ4: 0.9, considerationVsQ4: 1.6, intentVsQ4: 0.3,
        awarenessVsQ1LastYear: 1.4, familiarityVsQ1LastYear: 15.9, considerationVsQ1LastYear: 2.3, intentVsQ1LastYear: 1.9
      },
      'China': { 
        awareness: '49.9%', familiarity: '51.4%', consideration: '31.1%', intent: '9.2%',
        awarenessTarget: '49.9%', familiarityTarget: '50.7%', considerationTarget: '29.5%', intentTarget: '8.9%',
        awarenessVsTarget: 0.0, familiarityVsTarget: 0.7, considerationVsTarget: 1.6, intentVsTarget: 0.3,
        awarenessVsQ4: 0.7, familiarityVsQ4: 1.2, considerationVsQ4: 2.1, intentVsQ4: 1.0,
        awarenessVsQ1LastYear: 1.9, familiarityVsQ1LastYear: 12.4, considerationVsQ1LastYear: 0.7, intentVsQ1LastYear: 1.8
      },
      'Russia': { 
        awareness: '94.7%', familiarity: '60.0%', consideration: '58.2%', intent: '39.1%',
        awarenessTarget: '94.6%', familiarityTarget: '59.5%', considerationTarget: '57.5%', intentTarget: '39.5%',
        awarenessVsTarget: 0.1, familiarityVsTarget: 0.5, considerationVsTarget: 0.7, intentVsTarget: -0.4,
        awarenessVsQ4: 0.1, familiarityVsQ4: 0.9, considerationVsQ4: 1.0, intentVsQ4: 0.3,
        awarenessVsQ1LastYear: 0.2, familiarityVsQ1LastYear: 12.0, considerationVsQ1LastYear: 1.9, intentVsQ1LastYear: 0.0
      },
      'France': { 
        awareness: '75.8%', familiarity: '52.3%', consideration: '24.1%', intent: '19.8%',
        awarenessTarget: '75.7%', familiarityTarget: '52.2%', considerationTarget: '23.8%', intentTarget: '13.8%',
        awarenessVsTarget: 0.0, familiarityVsTarget: 0.1, considerationVsTarget: 0.3, intentVsTarget: 1.1,
        awarenessVsQ4: 0.7, familiarityVsQ4: 0.4, considerationVsQ4: 1.1, intentVsQ4: 1.6,
        awarenessVsQ1LastYear: 1.7, familiarityVsQ1LastYear: 15.9, considerationVsQ1LastYear: 0.7, intentVsQ1LastYear: 2.5
      },
      'KSA': { 
        awareness: '97.1%', familiarity: '74.7%', consideration: '61.9%', intent: '48.1%',
        awarenessTarget: '95.4%', familiarityTarget: '73.2%', considerationTarget: '62.0%', intentTarget: '46.5%',
        awarenessVsTarget: 1.7, familiarityVsTarget: 1.5, considerationVsTarget: -0.1, intentVsTarget: 1.7,
        awarenessVsQ4: 1.7, familiarityVsQ4: 1.9, considerationVsQ4: 0.4, intentVsQ4: 1.9,
        awarenessVsQ1LastYear: 3.6, familiarityVsQ1LastYear: 27.2, considerationVsQ1LastYear: 0.3, intentVsQ1LastYear: 2.5
      },
      'Italy': { 
        awareness: '81.7%', familiarity: '43.0%', consideration: '32.3%', intent: '17.9%',
        awarenessTarget: '81.5%', familiarityTarget: '43.4%', considerationTarget: '31.9%', intentTarget: '18.6%',
        awarenessVsTarget: 0.2, familiarityVsTarget: -0.4, considerationVsTarget: 0.4, intentVsTarget: -0.7,
        awarenessVsQ4: 0.7, familiarityVsQ4: -0.1, considerationVsQ4: 0.8, intentVsQ4: 0.7,
        awarenessVsQ1LastYear: 0.4, familiarityVsQ1LastYear: 14.3, considerationVsQ1LastYear: 1.3, intentVsQ1LastYear: -3.4
      },
      'Kuwait': { 
        awareness: '90.1%', familiarity: '56.3%', consideration: '48.1%', intent: '27.4%',
        awarenessTarget: '90.6%', familiarityTarget: '55.8%', considerationTarget: '45.0%', intentTarget: '25.5%',
        awarenessVsTarget: -0.5, familiarityVsTarget: 0.5, considerationVsTarget: 3.1, intentVsTarget: 0.7,
        awarenessVsQ4: 0.0, familiarityVsQ4: 0.8, considerationVsQ4: 3.4, intentVsQ4: 1.1,
        awarenessVsQ1LastYear: 3.0, familiarityVsQ1LastYear: 19.4, considerationVsQ1LastYear: 1.8, intentVsQ1LastYear: 2.9
      }
    }
  };
}

// Function to run the validation
async function runValidation() {
  try {
    // Load the CSV data
    const csvText = await loadCSVData();
    
    // Parse the CSV data
    const csvData = parseCSVForValidation(csvText);
    
    // Get the hardcoded data from the code
    const codeData = getCodeData();
    
    // Validate the comparisons
    const discrepancies = validateComparisons(csvData, codeData);
    
    // Display the results
    displayResults(discrepancies, csvData, codeData);
  } catch (error) {
    console.error('Error running validation:', error);
    document.getElementById('validation-results').innerHTML = `
      <div class="error-message">
        <h3>Error Running Validation</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Function to display the validation results
function displayResults(discrepancies, csvData, codeData) {
  const resultsContainer = document.getElementById('validation-results');
  
  // Clear the container
  resultsContainer.innerHTML = '';
  
  // Add the header
  const header = document.createElement('h2');
  header.textContent = 'Validation Results';
  resultsContainer.appendChild(header);
  
  // Check if there are any discrepancies
  const hasOverallDiscrepancies = discrepancies.overall.length > 0;
  const hasMarketDiscrepancies = Object.keys(discrepancies.markets).length > 0;
  
  if (!hasOverallDiscrepancies && !hasMarketDiscrepancies) {
    const noDiscrepanciesMessage = document.createElement('p');
    noDiscrepanciesMessage.textContent = 'No discrepancies found. All comparisons match.';
    noDiscrepanciesMessage.className = 'success-message';
    resultsContainer.appendChild(noDiscrepanciesMessage);
    return;
  }
  
  // Add overall discrepancies
  if (hasOverallDiscrepancies) {
    const overallHeader = document.createElement('h3');
    overallHeader.textContent = 'Overall Metric Discrepancies';
    resultsContainer.appendChild(overallHeader);
    
    const overallTable = document.createElement('table');
    overallTable.className = 'discrepancy-table';
    
    // Add table header
    const overallTableHeader = document.createElement('thead');
    overallTableHeader.innerHTML = `
      <tr>
        <th>Metric</th>
        <th>Comparison</th>
        <th>CSV Value</th>
        <th>Code Value</th>
        <th>Difference</th>
      </tr>
    `;
    overallTable.appendChild(overallTableHeader);
    
    // Add table body
    const overallTableBody = document.createElement('tbody');
    
    discrepancies.overall.forEach(discrepancy => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${discrepancy.metric}</td>
        <td>${discrepancy.comparison}</td>
        <td>${discrepancy.csvValue}%</td>
        <td>${discrepancy.codeValue}%</td>
        <td>${discrepancy.difference.toFixed(1)}%</td>
      `;
      overallTableBody.appendChild(row);
    });
    
    overallTable.appendChild(overallTableBody);
    resultsContainer.appendChild(overallTable);
  }
  
  // Add market discrepancies
  if (hasMarketDiscrepancies) {
    const marketHeader = document.createElement('h3');
    marketHeader.textContent = 'Market Metric Discrepancies';
    resultsContainer.appendChild(marketHeader);
    
    for (const market in discrepancies.markets) {
      const marketDiscrepancies = discrepancies.markets[market];
      
      const marketSubheader = document.createElement('h4');
      marketSubheader.textContent = market;
      resultsContainer.appendChild(marketSubheader);
      
      const marketTable = document.createElement('table');
      marketTable.className = 'discrepancy-table';
      
      // Add table header
      const marketTableHeader = document.createElement('thead');
      marketTableHeader.innerHTML = `
        <tr>
          <th>Metric</th>
          <th>Comparison</th>
          <th>CSV Value</th>
          <th>Code Value</th>
          <th>Difference</th>
          <th>Notes</th>
        </tr>
      `;
      marketTable.appendChild(marketTableHeader);
      
      // Add table body
      const marketTableBody = document.createElement('tbody');
      
      marketDiscrepancies.forEach(discrepancy => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${discrepancy.metric}</td>
          <td>${discrepancy.comparison}</td>
          <td>${discrepancy.csvValue !== undefined ? discrepancy.csvValue + '%' : 'N/A'}</td>
          <td>${discrepancy.codeValue !== undefined ? discrepancy.codeValue + '%' : (discrepancy.calculatedValue !== undefined ? discrepancy.calculatedValue.toFixed(1) + '%' : 'N/A')}</td>
          <td>${discrepancy.difference.toFixed(1)}%</td>
          <td>${discrepancy.note || ''}</td>
        `;
        marketTableBody.appendChild(row);
      });
      
      marketTable.appendChild(marketTableBody);
      resultsContainer.appendChild(marketTable);
    }
  }
  
  // Add a section for US and China Intent specifically
  const focusHeader = document.createElement('h3');
  focusHeader.textContent = 'Focus on US and China Intent';
  resultsContainer.appendChild(focusHeader);
  
  const focusTable = document.createElement('table');
  focusTable.className = 'discrepancy-table';
  
  // Add table header
  const focusTableHeader = document.createElement('thead');
  focusTableHeader.innerHTML = `
    <tr>
      <th>Market</th>
      <th>CSV Intent Value</th>
      <th>Code Intent Value</th>
      <th>CSV VS Target</th>
      <th>Code VS Target</th>
      <th>CSV Target (calculated)</th>
      <th>Code Target</th>
    </tr>
  `;
  focusTable.appendChild(focusTableHeader);
  
  // Add table body
  const focusTableBody = document.createElement('tbody');
  
  // Add US row
  const usRow = document.createElement('tr');
  const usCSVIntent = csvData.markets['US']?.intent?.value || 'N/A';
  const usCodeIntent = parseFloat(codeData.markets['US'].intent.replace('%', ''));
  const usCSVVsTarget = csvData.markets['US']?.intent?.vsTarget || 'N/A';
  const usCodeVsTarget = codeData.markets['US'].intentVsTarget;
  const usCSVTarget = usCSVIntent - usCSVVsTarget;
  const usCodeTarget = parseFloat(codeData.markets['US'].intentTarget.replace('%', ''));
  
  usRow.innerHTML = `
    <td>US</td>
    <td>${usCSVIntent}%</td>
    <td>${usCodeIntent}%</td>
    <td>${usCSVVsTarget}%</td>
    <td>${usCodeVsTarget}%</td>
    <td>${usCSVTarget.toFixed(1)}%</td>
    <td>${usCodeTarget}%</td>
  `;
  focusTableBody.appendChild(usRow);
  
  // Add China row
  const chinaRow = document.createElement('tr');
  const chinaCSVIntent = csvData.markets['China']?.intent?.value || 'N/A';
  const chinaCodeIntent = parseFloat(codeData.markets['China'].intent.replace('%', ''));
  const chinaCSVVsTarget = csvData.markets['China']?.intent?.vsTarget || 'N/A';
  const chinaCodeVsTarget = codeData.markets['China'].intentVsTarget;
  const chinaCSVTarget = chinaCSVIntent - chinaCSVVsTarget;
  const chinaCodeTarget = parseFloat(codeData.markets['China'].intentTarget.replace('%', ''));
  
  chinaRow.innerHTML = `
    <td>China</td>
    <td>${chinaCSVIntent}%</td>
    <td>${chinaCodeIntent}%</td>
    <td>${chinaCSVVsTarget}%</td>
    <td>${chinaCodeVsTarget}%</td>
    <td>${chinaCSVTarget.toFixed(1)}%</td>
    <td>${chinaCodeTarget}%</td>
  `;
  focusTableBody.appendChild(chinaRow);
  
  focusTable.appendChild(focusTableBody);
  resultsContainer.appendChild(focusTable);
  
  // Add recommendations
  const recommendationsHeader = document.createElement('h3');
  recommendationsHeader.textContent = 'Recommendations';
  resultsContainer.appendChild(recommendationsHeader);
  
  const recommendations = document.createElement('ul');
  
  // Add recommendation for US Intent
  const usRecommendation = document.createElement('li');
  usRecommendation.innerHTML = `
    <strong>US Intent:</strong> Update the code value from ${usCodeIntent}% to ${usCSVIntent}% and VS Target from ${usCodeVsTarget}% to ${usCSVVsTarget}%.
  `;
  recommendations.appendChild(usRecommendation);
  
  // Add recommendation for China Intent
  const chinaRecommendation = document.createElement('li');
  chinaRecommendation.innerHTML = `
    <strong>China Intent:</strong> Update the code value from ${chinaCodeIntent}% to ${chinaCSVIntent}% and VS Target from ${chinaCodeVsTarget}% to ${chinaCSVVsTarget}%.
  `;
  recommendations.appendChild(chinaRecommendation);
  
  // Add general recommendation
  const generalRecommendation = document.createElement('li');
  generalRecommendation.innerHTML = `
    <strong>General:</strong> Consider updating the code to directly parse the CSV file instead of using hardcoded values to prevent discrepancies.
  `;
  recommendations.appendChild(generalRecommendation);
  
  resultsContainer.appendChild(recommendations);
}

// Run the validation when the page loads
document.addEventListener('DOMContentLoaded', function() {
  runValidation();
});
