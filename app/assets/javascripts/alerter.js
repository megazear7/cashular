(function() {
  $(document).ready(function() {
    var message;
    if ($("#alert").length > 0) {
      message = $("#alert").data().message;
    } else if ($("#notice").length > 0) {
      message = $("#notice").data().message;
    }

    if (typeof message !== "undefined") {
      var snackbarContainer = document.querySelector('#snackbar-alerter');

      var data = {
        message: message,
        timeout: 5000,
        actionText: 'Undo'
      };

      var snackbar = new MaterialSnackbar(snackbarContainer);
      snackbar.showSnackbar(data);
    }
  });
}());
