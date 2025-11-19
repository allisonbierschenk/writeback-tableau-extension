/* global tableau */

tableau.extensions.initializeDialogAsync();

const updateRequest = requestid => {
  const tech = $("#tech").val();
  const status = $("#status").val();
  const comments = $("#comments").val();
  
  console.log("Updating request:", requestid, { tech, status, comments });
  
  $.post("/update/" + requestid, { tech, status, comments }, updated => {
    console.log("Update response:", updated);
    // Close dialog with the result (true if successful, false if failed)
    // This will be passed back to the parent extension as closePayload
    tableau.extensions.ui.closeDialog(updated);
  }).fail((xhr, status, error) => {
    console.error("Update failed:", error);
    alert("Error updating request: " + error);
    // Close dialog with false to indicate failure
    tableau.extensions.ui.closeDialog(false);
  });
};
