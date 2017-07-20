(function() {

window.Cashular = window.Cashular || { };
window.Cashular.Utils = window.Cashular.Utils || { };

window.Cashular.Utils.makeid = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

})();
