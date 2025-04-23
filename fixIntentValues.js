/**
 * Fix Intent Values Script
 * This script updates the Intent values for US and China in the populateMetricCards.js file
 * to match the values in the CSV file.
 */

// Function to read a file
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fetch(filePath)
      .then(response => response.text())
      .then(text => resolve(text))
      .catch(error => reject(error));
  });
}

// Function to update the US Intent values
function updateUSIntentValues(fileContent) {
  console.log('Updating US Intent values...');
  
  // CSV values: Q1 2025 = 11.20%, VS Target = 0.70%
  // Current code values: intent: '24.2%', intentTarget: '10.5%', intentVsTarget: 13.7
  
  // Replace the US Intent value
  fileContent = fileContent.replace(
    /'US': \{\s*awareness: '79\.5%', familiarity: '44\.0%', consideration: '41\.3%', intent: '24\.2%',/,
    "'US': { awareness: '79.5%', familiarity: '44.0%', consideration: '41.3%', intent: '11.2%',"
  );
  
  // Replace the US Intent vs Target value
  fileContent = fileContent.replace(
    /intentTarget: '10\.5%', intentVsTarget: 13\.7,/,
    "intentTarget: '10.5%', intentVsTarget: 0.7,"
  );
  
  return fileContent;
}

// Function to update the China Intent values
function updateChinaIntentValues(fileContent) {
  console.log('Updating China Intent values...');
  
  // CSV values: Q1 2025 = 9.20%, VS Target = 0.30%
  // Current code values: intent: '18.5%', intentTarget: '8.9%', intentVsTarget: 9.6
  
  // Replace the China Intent value
  fileContent = fileContent.replace(
    /'China': \{\s*awareness: '49\.9%', familiarity: '51\.4%', consideration: '31\.1%', intent: '18\.5%',/,
    "'China': { awareness: '49.9%', familiarity: '51.4%', consideration: '31.1%', intent: '9.2%',"
  );
  
  // Replace the China Intent vs Target value
  fileContent = fileContent.replace(
    /intentTarget: '8\.9%', intentVsTarget: 9\.6,/,
    "intentTarget: '8.9%', intentVsTarget: 0.3,"
  );
  
  return fileContent;
}

// Function to update the India Intent values
function updateIndiaIntentValues(fileContent) {
  console.log('Updating India Intent values...');
  
  // CSV values: Q1 2025 = 64.90%, VS Target = 0.20%
  // Current code values: intent: '42.1%', intentTarget: '64.7%', intentVsTarget: 0.2
  
  // Replace the India Intent value
  fileContent = fileContent.replace(
    /'India': \{\s*awareness: '95\.2%', familiarity: '74\.4%', consideration: '76\.0%', intent: '42\.1%',/,
    "'India': { awareness: '95.2%', familiarity: '74.4%', consideration: '76.0%', intent: '64.9%',"
  );
  
  return fileContent;
}

// Function to update the Russia Intent values
function updateRussiaIntentValues(fileContent) {
  console.log('Updating Russia Intent values...');
  
  // CSV values: Q1 2025 = 39.10%, VS Target = -0.40%
  // Current code values: intent: '31.6%', intentTarget: '39.5%', intentVsTarget: -0.4
  
  // Replace the Russia Intent value
  fileContent = fileContent.replace(
    /'Russia': \{\s*awareness: '94\.7%', familiarity: '60\.0%', consideration: '58\.2%', intent: '31\.6%',/,
    "'Russia': { awareness: '94.7%', familiarity: '60.0%', consideration: '58.2%', intent: '39.1%',"
  );
  
  return fileContent;
}

// Function to update the France Intent values
function updateFranceIntentValues(fileContent) {
  console.log('Updating France Intent values...');
  
  // CSV values: Q1 2025 = 14.90%, VS Target = 1.10%
  // Current code values: intent: '19.8%', intentTarget: '13.8%', intentVsTarget: 1.1
  
  // Replace the France Intent value
  fileContent = fileContent.replace(
    /'France': \{\s*awareness: '75\.8%', familiarity: '52\.3%', consideration: '24\.1%', intent: '19\.8%',/,
    "'France': { awareness: '75.8%', familiarity: '52.3%', consideration: '24.1%', intent: '14.9%',"
  );
  
  return fileContent;
}

// Function to update the KSA Intent values
function updateKSAIntentValues(fileContent) {
  console.log('Updating KSA Intent values...');
  
  // CSV values: Q1 2025 = 48.20%, VS Target = 1.70%
  // Current code values: intent: '48.1%', intentTarget: '46.5%', intentVsTarget: 1.7
  
  // Replace the KSA Intent value
  fileContent = fileContent.replace(
    /'KSA': \{\s*awareness: '97\.1%', familiarity: '74\.7%', consideration: '61\.9%', intent: '48\.1%',/,
    "'KSA': { awareness: '97.1%', familiarity: '74.7%', consideration: '61.9%', intent: '48.2%',"
  );
  
  return fileContent;
}

// Function to update the Italy Intent values
function updateItalyIntentValues(fileContent) {
  console.log('Updating Italy Intent values...');
  
  // CSV values: Q1 2025 = 17.90%, VS Target = -0.70%
  // Current code values: intent: '17.9%', intentTarget: '18.6%', intentVsTarget: -0.7
  
  // Replace the Italy Intent value
  fileContent = fileContent.replace(
    /'Italy': \{\s*awareness: '81\.7%', familiarity: '43\.0%', consideration: '32\.3%', intent: '17\.9%',/,
    "'Italy': { awareness: '81.7%', familiarity: '43.0%', consideration: '32.3%', intent: '17.9%',"
  );
  
  return fileContent;
}

// Function to update the Kuwait Intent values
function updateKuwaitIntentValues(fileContent) {
  console.log('Updating Kuwait Intent values...');
  
  // CSV values: Q1 2025 = 26.20%, VS Target = 0.70%
  // Current code values: intent: '27.4%', intentTarget: '25.5%', intentVsTarget: 0.7
  
  // Replace the Kuwait Intent value
  fileContent = fileContent.replace(
    /'Kuwait': \{\s*awareness: '90\.1%', familiarity: '56\.3%', consideration: '48\.1%', intent: '27\.4%',/,
    "'Kuwait': { awareness: '90.1%', familiarity: '56.3%', consideration: '48.1%', intent: '26.2%',"
  );
  
  return fileContent;
}

// Function to update the latestData section
function updateLatestDataSection(fileContent) {
  console.log('Updating latestData section...');
  
  // Replace the US Intent value in latestData
  fileContent = fileContent.replace(
    /'US': \{ awareness: 79\.5, familiarity: 44\.0, consideration: 41\.3, intent: 24\.2 \},/,
    "'US': { awareness: 79.5, familiarity: 44.0, consideration: 41.3, intent: 11.2 },"
  );
  
  // Replace the China Intent value in latestData
  fileContent = fileContent.replace(
    /'China': \{ awareness: 49\.9, familiarity: 51\.4, consideration: 31\.1, intent: 18\.5 \},/,
    "'China': { awareness: 49.9, familiarity: 51.4, consideration: 31.1, intent: 9.2 },"
  );
  
  // Replace the India Intent value in latestData
  fileContent = fileContent.replace(
    /'India': \{ awareness: 95\.2, familiarity: 74\.4, consideration: 76\.0, intent: 42\.1 \},/,
    "'India': { awareness: 95.2, familiarity: 74.4, consideration: 76.0, intent: 64.9 },"
  );
  
  // Replace the Russia Intent value in latestData
  fileContent = fileContent.replace(
    /'Russia': \{ awareness: 94\.7, familiarity: 60\.0, consideration: 58\.2, intent: 31\.6 \},/,
    "'Russia': { awareness: 94.7, familiarity: 60.0, consideration: 58.2, intent: 39.1 },"
  );
  
  return fileContent;
}

// Function to update the heatmap values
function updateHeatmapValues(fileContent) {
  console.log('Updating heatmap values...');
  
  // This function ensures that the vs-target values are correctly updated in the heatmap table
  // The updateHeatmapView function in createCharts.js gets these values from data.markets[market][`${metric}VsTarget`]
  
  // Make sure the US Intent vs Target value is correctly set to 0.7 in all places
  // This is needed for the performance heatmap table
  fileContent = fileContent.replace(
    /intentVsTarget: 13\.7,/g,
    "intentVsTarget: 0.7,"
  );
  
  // Make sure the China Intent vs Target value is correctly set to 0.3 in all places
  fileContent = fileContent.replace(
    /intentVsTarget: 9\.6,/g,
    "intentVsTarget: 0.3,"
  );
  
  return fileContent;
}

// Main function to fix the Intent values
async function fixIntentValues() {
  try {
    // Read the populateMetricCards.js file
    const filePath = 'populateMetricCards.js';
    const fileContent = await readFile(filePath);
    
    // Update the Intent values for all markets
    let updatedContent = updateUSIntentValues(fileContent);
    updatedContent = updateChinaIntentValues(updatedContent);
    updatedContent = updateIndiaIntentValues(updatedContent);
    updatedContent = updateRussiaIntentValues(updatedContent);
    updatedContent = updateFranceIntentValues(updatedContent);
    updatedContent = updateKSAIntentValues(updatedContent);
    updatedContent = updateItalyIntentValues(updatedContent);
    updatedContent = updateKuwaitIntentValues(updatedContent);
    updatedContent = updateLatestDataSection(updatedContent);
    updatedContent = updateHeatmapValues(updatedContent);
    
    // Display the changes
    console.log('Changes to be made:');
    console.log('1. US Intent: 24.2% -> 11.2%');
    console.log('2. US Intent vs Target: 13.7% -> 0.7%');
    console.log('3. China Intent: 18.5% -> 9.2%');
    console.log('4. China Intent vs Target: 9.6% -> 0.3%');
    console.log('5. India Intent: 42.1% -> 64.9%');
    console.log('6. Russia Intent: 31.6% -> 39.1%');
    console.log('7. France Intent: 19.8% -> 14.9%');
    console.log('8. KSA Intent: 48.1% -> 48.2%');
    console.log('9. Italy Intent: 17.9% -> 17.9% (no change)');
    console.log('10. Kuwait Intent: 27.4% -> 26.2%');
    
    // Create a download link for the updated file
    const blob = new Blob([updatedContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'populateMetricCards.js';
    downloadLink.textContent = 'Download Updated File';
    downloadLink.className = 'download-button';
    
    // Add the download link to the page
    const resultContainer = document.getElementById('fix-result');
    if (resultContainer) {
      resultContainer.innerHTML = '';
      
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = '<h3>Intent Values Fixed Successfully</h3><p>The Intent values for all markets (US, China, India, Russia, France, KSA, Italy, and Kuwait) have been updated to match the CSV file. Click the button below to download the updated file.</p>';
      
      resultContainer.appendChild(successMessage);
      resultContainer.appendChild(downloadLink);
    }
  } catch (error) {
    console.error('Error fixing Intent values:', error);
    
    // Display the error
    const resultContainer = document.getElementById('fix-result');
    if (resultContainer) {
      resultContainer.innerHTML = '';
      
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.innerHTML = `<h3>Error Fixing Intent Values</h3><p>${error.message}</p>`;
      
      resultContainer.appendChild(errorMessage);
    }
  }
}

// Add event listener for the fix button
document.addEventListener('DOMContentLoaded', function() {
  const fixButton = document.getElementById('fix-intent-values');
  if (fixButton) {
    fixButton.addEventListener('click', fixIntentValues);
  }
});
