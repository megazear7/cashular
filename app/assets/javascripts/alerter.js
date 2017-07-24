(function() {
  $(document).ready(function() {
    var message;
    if ($("#alert").length > 0) {
      message = $("#alert").data().message;
    } else if ($("#notice").length > 0) {
      message = $("#notice").data().message;
    }

    if (typeof message !== "undefined") {
      var snackbarContainer = document.querySelector('#demo-snackbar-example');

      var data = {
        message: message,
        timeout: 2000,
        actionText: 'Undo'
      };

      var snackbar = new MaterialSnackbar(snackbarContainer);
      snackbar.showSnackbar(data);
    }
  });
}());
