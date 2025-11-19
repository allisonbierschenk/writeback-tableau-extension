/* global tableau */
console.log("Initializing Tableau Extension...");
tableau.extensions.initializeAsync().then(() => {
  let worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  let worksheet = worksheets.find(ws => ws.name === "Requests");
  console.log("worksheets", worksheet)
  console.log("Registering event listener")
  let unregisterHandler = worksheet.addEventListener(
    tableau.TableauEventType.MarkSelectionChanged,
    edit
  );
});

const edit = async event => {
  let data = await event.getMarksAsync();
  data = data.data[0];

  const index = data.columns.find(col => col.fieldName === "Request Id").index;
  const requestid = data.data[0][index].value;

  const url = `${window.location.origin}/request/${requestid}`;

  let closePayload = await tableau.extensions.ui.displayDialogAsync(url, null, {width: 600, height: 450});
  console.log("closePayload", closePayload);
  
  // Refresh the dashboard if update was successful
  // closePayload will be true if the dialog was closed with a successful update
  if (closePayload === true || closePayload === "true") {
    console.log("Update successful, refreshing dashboard...");
    try {
      // Get the worksheet that triggered this event
      const worksheet = event.worksheet;
      
      // Refresh all data sources for this worksheet
      const dataSources = await worksheet.getDataSourcesAsync();
      console.log("Refreshing data sources:", dataSources.length);
      
      // Refresh all data sources
      for (let dataSource of dataSources) {
        await dataSource.refreshAsync();
        console.log("Refreshed data source:", dataSource.name);
      }
      
      // Also refresh the dashboard to update all worksheets
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      await dashboard.refreshAsync();
      console.log("Dashboard refreshed");
      
    } catch (err) {
      console.error("Error refreshing dashboard:", err);
      alert("Update successful but failed to refresh dashboard. Please refresh manually.");
    }
  } else if (closePayload === false || closePayload === "false") {
    alert("Error trying to update request!");
  }
};