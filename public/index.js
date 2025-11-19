/* global tableau */
tableau.extensions.initializeAsync().then(() => {
  let worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  let worksheet = worksheets.find(ws => ws.name === "Requests");
  if (worksheet) {
    worksheet.addEventListener(
      tableau.TableauEventType.MarkSelectionChanged,
      edit
    );
  }
});

const edit = async event => {
  let data = await event.getMarksAsync();
  data = data.data[0];

  const index = data.columns.find(col => col.fieldName === "Request Id").index;
  const requestid = data.data[0][index].value;

  const url = `${window.location.origin}/request/${requestid}`;

  let closePayload = await tableau.extensions.ui.displayDialogAsync(url, null, {width: 600, height: 450});
  
  // Refresh the dashboard if update was successful
  if (closePayload === true || closePayload === "true") {
    try {
      const worksheet = event.worksheet;
      const dataSources = await worksheet.getDataSourcesAsync();
      
      // Refresh all data sources
      for (let dataSource of dataSources) {
        await dataSource.refreshAsync();
      }
      
      // Refresh the dashboard to update all worksheets
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      await dashboard.refreshAsync();
    } catch (err) {
      // Silent fail - just don't refresh
    }
  }
};