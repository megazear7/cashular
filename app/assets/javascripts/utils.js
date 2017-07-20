(function() {

window.Cashular = window.Cashular || { };
window.Cashular.Utils = window.Cashular.Utils || { };

window.Cashular.Utils.makeid = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

window.Cashular.Utils.daysAgo = function(days) {
    var today = new Date();
    today.setDate(today.getDate() - days);
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd="0" + dd;
    } 

    if (mm < 10) {
        mm = "0" + mm;
    } 

    return yyyy + "-" + mm + "-" + dd;
}

})();
