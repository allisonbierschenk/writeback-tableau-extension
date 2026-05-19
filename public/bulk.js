/* global tableau */

tableau.extensions.initializeDialogAsync();

$(function () {
  $(".apply-toggle").on("change", function () {
    const target = $(this).data("target");
    $("#" + target).prop("disabled", !this.checked);
    refreshSubmitState();
  });
});

function refreshSubmitState() {
  const anyChecked = $(".apply-toggle:checked").length > 0;
  $("#bulkSubmit").prop("disabled", !anyChecked);
}

const updateBulk = () => {
  const payload = { ids: $("#ids").val() };

  if ($("#applyTech").is(":checked")) {
    payload.applyTech = "1";
    payload.tech = $("#tech").val();
  }
  if ($("#applyStatus").is(":checked")) {
    payload.applyStatus = "1";
    payload.status = $("#status").val();
  }
  if ($("#applyComments").is(":checked")) {
    payload.applyComments = "1";
    payload.comments = $("#comments").val();
  }

  $.post("/update-bulk", payload, updated => {
    tableau.extensions.ui.closeDialog(updated);
  }).fail(() => {
    tableau.extensions.ui.closeDialog(false);
  });
};

const cancelBulk = () => {
  tableau.extensions.ui.closeDialog(false);
};
