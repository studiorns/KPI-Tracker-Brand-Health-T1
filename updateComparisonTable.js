/**
 * Update Comparison Table Script
 * This script directly updates the comparison table cells with the correct values for all markets
 */

// Function to update the comparison table cells
function updateComparisonTableCells() {
  console.log('Updating comparison table cells...');
  
  // Get the table body
  const tableBody = document.getElementById('comparison-table-body');
  if (!tableBody) {
    console.error('Comparison table body not found');
    return;
  }
  
  // Get the current metric
  const metricSelect = document.getElementById('metric-filter');
  const metric = metricSelect ? metricSelect.value : 'awareness';
  
  // Get all rows in the table body
  const rows = tableBody.querySelectorAll('tr');
  
  // Loop through all rows
  rows.forEach(row => {
    // Get the market name from the first cell
    const marketCell = row.querySelector('td.market-name');
    if (!marketCell) return;
    
    const market = marketCell.textContent;
    
    // Get all cells in the row
    const cells = row.querySelectorAll('td');
    
    // Skip if there aren't enough cells
    if (cells.length < 6) return;
    
    // Only update the Intent values
    if (metric === 'intent') {
      // Current value cell (index 1)
      const valueCell = cells[1];
      
      // Target cell (index 2)
      const targetCell = cells[2];
      
      // Vs Target cell (index 3)
      const vsTargetCell = cells[3];
      
      // Vs Q4 cell (index 4)
      const vsQ4Cell = cells[4];
      
      // Vs Q1 Last Year cell (index 5)
      const vsQ1LYCell = cells[5];
      
      // Update the cells based on the market
      switch (market) {
        case 'US':
          valueCell.textContent = '11.2%';
          vsTargetCell.textContent = '+0.7%';
          vsTargetCell.className = 'comparison-positive';
          break;
          
        case 'China':
          valueCell.textContent = '9.2%';
          vsTargetCell.textContent = '+0.3%';
          vsTargetCell.className = 'comparison-positive';
          break;
          
        case 'India':
          valueCell.textContent = '64.9%';
          vsTargetCell.textContent = '+0.2%';
          vsTargetCell.className = 'comparison-positive';
          break;
          
        case 'Russia':
          valueCell.textContent = '39.1%';
          vsTargetCell.textContent = '-0.4%';
          vsTargetCell.className = 'comparison-negative';
          break;
          
        case 'France':
          valueCell.textContent = '14.9%';
          vsTargetCell.textContent = '+1.1%';
          vsTargetCell.className = 'comparison-positive';
          break;
          
        case 'KSA':
          valueCell.textContent = '48.2%';
          vsTargetCell.textContent = '+1.7%';
          vsTargetCell.className = 'comparison-positive';
          break;
          
        case 'Italy':
          valueCell.textContent = '17.9%';
          vsTargetCell.textContent = '-0.7%';
          vsTargetCell.className = 'comparison-negative';
          break;
          
        case 'Kuwait':
          valueCell.textContent = '26.2%';
          vsTargetCell.textContent = '+0.7%';
          vsTargetCell.className = 'comparison-positive';
          break;
      }
    }
  });
  
  console.log('Comparison table cells updated successfully');
}

// Function to update the metric filter event listener
function updateMetricFilterListener() {
  console.log('Updating metric filter listener...');
  
  // Get the metric filter
  const metricFilter = document.getElementById('metric-filter');
  if (!metricFilter) {
    console.error('Metric filter not found');
    return;
  }
  
  // Remove existing event listeners
  const newMetricFilter = metricFilter.cloneNode(true);
  metricFilter.parentNode.replaceChild(newMetricFilter, metricFilter);
  
  // Add new event listener
  newMetricFilter.addEventListener('change', function() {
    // Get the sort by value
    const sortBySelect = document.getElementById('sort-by');
    const sortBy = sortBySelect ? sortBySelect.value : 'value';
    
    // Call the original updateComparisonTable function
    updateComparisonTable(this.value, sortBy);
    
    // Then update the cells
    setTimeout(updateComparisonTableCells, 100);
  });
  
  console.log('Metric filter listener updated successfully');
}

// Function to update the sort by event listener
function updateSortByListener() {
  console.log('Updating sort by listener...');
  
  // Get the sort by filter
  const sortByFilter = document.getElementById('sort-by');
  if (!sortByFilter) {
    console.error('Sort by filter not found');
    return;
  }
  
  // Remove existing event listeners
  const newSortByFilter = sortByFilter.cloneNode(true);
  sortByFilter.parentNode.replaceChild(newSortByFilter, sortByFilter);
  
  // Add new event listener
  newSortByFilter.addEventListener('change', function() {
    // Get the metric value
    const metricSelect = document.getElementById('metric-filter');
    const metric = metricSelect ? metricSelect.value : 'awareness';
    
    // Call the original updateComparisonTable function
    updateComparisonTable(metric, this.value);
    
    // Then update the cells
    setTimeout(updateComparisonTableCells, 100);
  });
  
  console.log('Sort by listener updated successfully');
}

// Initialize the comparison table update
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing comparison table update...');
  
  // Wait for the comparison table to be initialized
  setTimeout(function() {
    // Update the comparison table cells
    updateComparisonTableCells();
    
    // Update the metric filter listener
    updateMetricFilterListener();
    
    // Update the sort by listener
    updateSortByListener();
    
    console.log('Comparison table update initialized successfully');
  }, 1000);
});
