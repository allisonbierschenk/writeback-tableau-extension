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
  let marks = await event.getMarksAsync();
  const table = marks.data[0];
  if (!table || table.data.length === 0) return;

  const idIndex = table.columns.find(col => col.fieldName === "Request Id").index;
  const ids = [...new Set(table.data.map(row => row[idIndex].value))];

  const url = ids.length === 1
    ? `${window.location.origin}/request/${ids[0]}`
    : `${window.location.origin}/bulk?ids=${ids.join(",")}`;

  const dialogSize = ids.length === 1 ? {width: 600, height: 450} : {width: 600, height: 500};
  const closePayload = await tableau.extensions.ui.displayDialogAsync(url, null, dialogSize);

  if (closePayload === true || closePayload === "true") {
    try {
      const dataSources = await event.worksheet.getDataSourcesAsync();
      for (const dataSource of dataSources) {
        await dataSource.refreshAsync();
      }
      await tableau.extensions.dashboardContent.dashboard.refreshAsync();
    } catch (err) {
      // Silent fail - just don't refresh
    }
  }
};
