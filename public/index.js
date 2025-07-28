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
console.log("closePayload", closePayload)
  if (closePayload) {
    let dataSources = await event.worksheet.getDataSourcesAsync();
    console.log("dataSources", dataSources)
    dataSources[0].refreshAsync();
  } else {
    alert("Error trying to update request!");
  }
};