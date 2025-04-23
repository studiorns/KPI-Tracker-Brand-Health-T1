# Brand Health KPI Dashboard

This dashboard displays key performance indicators (KPIs) for brand health across Tier 1 markets. It includes metrics for Awareness, Familiarity, Consideration, and Intent, with comparisons against targets and previous periods.

## Features

- Overall brand health metrics with comparisons against targets and previous periods
- Market performance analysis with comparative tables and heatmaps
- Market quadrant analysis to identify leading markets, growth opportunities, stable performers, and underperforming markets
- Detailed metric deep dives with trend charts and market comparisons
- Future projections for brand health metrics

## Validation Tool

A validation tool is included to verify the accuracy of the data displayed in the dashboard. This tool compares the values in the CSV file with the hardcoded values in the code and identifies any discrepancies.

### How to Use the Validation Tool

1. Open the dashboard by opening `index.html` in a web browser
2. Click on the "Validation Tool" link in the header
3. The validation tool will automatically check for discrepancies between the CSV data and the code
4. If discrepancies are found, you can use the "Fix Intent Values" button to update the code with the correct values

### Discrepancies Found

The validation tool has identified discrepancies in the Intent values for the US and China markets:

#### US Intent
- CSV Value: 11.2%
- Code Value: 24.2%
- VS Target (CSV): 0.7%
- VS Target (Code): 13.7%

#### China Intent
- CSV Value: 9.2%
- Code Value: 18.5%
- VS Target (CSV): 0.3%
- VS Target (Code): 9.6%

### Fixing Discrepancies

To fix the discrepancies:

1. Use the "Fix Intent Values" button in the validation tool
2. Download the updated `populateMetricCards.js` file
3. Replace the existing file with the downloaded file
4. Refresh the dashboard to see the updated values

## Data Flow

The dashboard currently uses hardcoded data in the `parseCSVData()` function in `populateMetricCards.js` instead of directly parsing the CSV file. This can lead to discrepancies if the CSV file is updated but the code is not.

### Recommendation

Consider updating the code to directly parse the CSV file to prevent future discrepancies. This would involve:

1. Modifying the `loadCSVData()` function in `Brand Health.js` to actually load the CSV file
2. Updating the `parseCSVData()` function in `populateMetricCards.js` to parse the CSV data instead of using hardcoded values
3. Ensuring that the parsed data is correctly formatted for use in the charts and tables

## Files

- `index.html`: Main dashboard page
- `Brand Health.js`: Main JavaScript file for the dashboard
- `populateMetricCards.js`: JavaScript file for populating the metric cards and parsing data
- `createCharts.js`: JavaScript file for creating the charts
- `validateComparisons.html`: Validation tool page
- `validateComparisons.js`: JavaScript file for the validation tool
- `fixIntentValues.js`: JavaScript file for fixing the Intent values
- `Files/March/march-brand-health-t1.csv`: CSV file containing the brand health data

## Development

To make changes to the dashboard:

1. Edit the HTML, CSS, and JavaScript files as needed
2. Use the validation tool to ensure that the data is accurate
3. Test the dashboard in a web browser

## License

© 2025 Research & Insights Unit | Strategic Marketing & Communications | Department of Culture and Tourism – Abu Dhabi
