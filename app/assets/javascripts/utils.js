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

window.Cashular.Utils.monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

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

window.Cashular.Utils.prettyDate = function(date) {
    var dd = date.getDate();
    var yyyy = date.getFullYear();

    if (dd < 10) {
        dd="0" + dd;
    } 

    return Cashular.Utils.monthNames[date.getMonth()] + " " + dd + ", " + yyyy;
};

window.Cashular.Utils.daysAgo = function(days) {
    var date = new Date();
    date.setDate(date.getDate() - days);

    return Cashular.Utils.formatDate(date);
};

window.Cashular.Utils.weeksAgo = function(weeks) {
    var weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate()-(7 * weeks));
    var day = weeksAgo.getDay();

    var monday = new Date(weeksAgo)
    monday.setDate(monday.getDate() - day + (day == 0 ? -6:1));

    var sunday = new Date(weeksAgo)
    sunday.setDate(sunday.getDate() + (7 - day));

    return {from: Cashular.Utils.formatDate(monday),
            to:   Cashular.Utils.formatDate(sunday)};
};

window.Cashular.Utils.monthsAgo = function(months) {
    var monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth()-months);

    var firstDay = new Date(monthsAgo)
    firstDay.setDate(1);

    var lastDay = new Date(monthsAgo.getFullYear(), monthsAgo.getMonth()+1, 0);



    return {from: Cashular.Utils.formatDate(firstDay),
            to:   Cashular.Utils.formatDate(lastDay),
            title: Cashular.Utils.monthNames[firstDay.getMonth()],
            year: firstDay.getFullYear()};
};

window.Cashular.Utils.yearsAgo = function(years) {
    var yearsAgo = new Date();
    yearsAgo.setYear(yearsAgo.getFullYear()-years);

    var firstDay = new Date(yearsAgo.getFullYear(), 0, 1);
    var lastDay = new Date(yearsAgo.getFullYear(), 12, 0);

    return {from: Cashular.Utils.formatDate(firstDay),
            to:   Cashular.Utils.formatDate(lastDay),
            title: ""+firstDay.getFullYear()};
};

})();
