/**
 * Update Heatmap Script
 * This script directly updates the heatmap cells with the correct values for US and China Intent
 */

// Function to update the heatmap cells
function updateHeatmapCells() {
  console.log('Updating heatmap cells...');
  
  // Get all heatmap cells
  const cells = document.querySelectorAll('.heatmap-cell');
  
  // Loop through all cells
  cells.forEach(cell => {
    const market = cell.getAttribute('data-market');
    const metric = cell.getAttribute('data-metric').toLowerCase();
    
    // Only update Intent cells for all markets
    if ((market === 'US' || market === 'China' || market === 'India' || market === 'Russia' || 
         market === 'France' || market === 'KSA' || market === 'Italy' || market === 'Kuwait') && metric === 'intent') {
      // Get the current view type
      const heatmapViewSelect = document.getElementById('heatmap-view');
      const viewType = heatmapViewSelect ? heatmapViewSelect.value : 'current';
      
      // Update the cell based on the view type
      switch (viewType) {
        case 'current':
          // Update the current value
          if (market === 'US') {
            cell.textContent = '11.2%';
          } else if (market === 'China') {
            cell.textContent = '9.2%';
          } else if (market === 'India') {
            cell.textContent = '64.9%';
          } else if (market === 'Russia') {
            cell.textContent = '39.1%';
          } else if (market === 'France') {
            cell.textContent = '14.9%';
          } else if (market === 'KSA') {
            cell.textContent = '48.2%';
          } else if (market === 'Italy') {
            cell.textContent = '17.9%';
          } else if (market === 'Kuwait') {
            cell.textContent = '26.2%';
          }
          break;
          
        case 'vs-target':
          // Update the vs target value
          if (market === 'US') {
            cell.textContent = '+0.7%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-4');
          } else if (market === 'China') {
            cell.textContent = '+0.3%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-3');
          } else if (market === 'India') {
            cell.textContent = '+0.2%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-3');
          } else if (market === 'Russia') {
            cell.textContent = '-0.4%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-1');
          } else if (market === 'France') {
            cell.textContent = '+1.1%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-5');
          } else if (market === 'KSA') {
            cell.textContent = '+1.7%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-5');
          } else if (market === 'Italy') {
            cell.textContent = '-0.7%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-1');
          } else if (market === 'Kuwait') {
            cell.textContent = '+0.7%';
            
            // Update the heat level class
            cell.className = cell.className.replace(/heat-level-\d/, 'heat-level-4');
          }
          break;
      }
    }
  });
  
  console.log('Heatmap cells updated successfully');
}

// Function to update the heatmap view select event listener
function updateHeatmapViewSelectListener() {
  console.log('Updating heatmap view select listener...');
  
  // Get the heatmap view select
  const heatmapViewSelect = document.getElementById('heatmap-view');
  if (!heatmapViewSelect) {
    console.error('Heatmap view select not found');
    return;
  }
  
  // Remove existing event listeners
  const newHeatmapViewSelect = heatmapViewSelect.cloneNode(true);
  heatmapViewSelect.parentNode.replaceChild(newHeatmapViewSelect, heatmapViewSelect);
  
  // Add new event listener
  newHeatmapViewSelect.addEventListener('change', function() {
    // Call the original updateHeatmapView function
    updateHeatmapView(this.value);
    
    // Then update the US and China Intent cells
    setTimeout(updateHeatmapCells, 100);
  });
  
  console.log('Heatmap view select listener updated successfully');
}

// Initialize the heatmap update
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing heatmap update...');
  
  // Wait for the heatmap to be initialized
  setTimeout(function() {
    // Update the heatmap cells
    updateHeatmapCells();
    
    // Update the heatmap view select listener
    updateHeatmapViewSelectListener();
    
    console.log('Heatmap update initialized successfully');
  }, 1000);
});
