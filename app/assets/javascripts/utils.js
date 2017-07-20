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
};

window.Cashular.Utils.formatDate = function(date) {
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();

    if (dd < 10) {
        dd="0" + dd;
    } 

    if (mm < 10) {
        mm = "0" + mm;
    } 

    return yyyy + "-" + mm + "-" + dd;
};

window.Cashular.Utils.daysAgo = function(days) {
    var date = new Date();
    date.setDate(date.getDate() - days);

    return Cashular.Utils.formatDate(date);
};

window.Cashular.Utils.weeksAgo = function(weeks) {
    var weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate()-(7 * weeks));

    var monday = new Date(weeksAgo)
    var day = monday.getDay();
    monday.setDate(monday.getDate() - day + (day == 0 ? -6:1));

    var sunday = new Date(weeksAgo)
    var day = sunday.getDay();
    sunday.setDate(sunday.getDate() + (7 - day));

    return {from: Cashular.Utils.formatDate(monday),
            to:   Cashular.Utils.formatDate(sunday)}
};

})();
