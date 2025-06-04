/* global tableau */

tableau.extensions.initializeDialogAsync();

const updateRequest = requestid => {
  const tech = $("#tech").val();
  const status = $("#status").val();
  const comments = $("#comments").val();
  $.post("/update/" + requestid, { tech, status, comments }, updated => {
    // alert("Woohoo!")
    tableau.extensions.ui.closeDialog(updated);
  });
};
