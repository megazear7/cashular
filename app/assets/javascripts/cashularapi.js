(function() {
    CashularRequest = function(plural, singular) {
        var self = this;

        self.requestMade = false;
        self.data = { };

        function makeRequest() {
            if (! self.requestMade) {
                self.requestMade = true;

                $.get("/"+plural, self.data)
                .done(function(response) {
                    $.each(response, function() {
                        if (typeof self.eachCallback === "function") {
                            self.eachCallback(this);
                        }
                    });

                    if (typeof self.allCallback === "function") {
                        self.allCallback(response);
                    }
                })
                .fail(function(error) {
                    if (typeof self.failCallback === "function") {
                        self.failCallback(error);
                    }
                })
                .always(function() {
                    if (typeof self.failCallback === "function") {
                        self.alwaysCallback();
                    }
                });
            }
        }

        self.each = function(callback) {
            self.eachCallback = callback;

            makeRequest();

            return self;
        };

        self.all = function(callback) {
            self.allCallback = callback;

            makeRequest();

            return self;
        };

        self.fail = function(callback) {
            self.failCallback = callback;

            return self;
        };

        self.always = function(callback) {
            self.alwaysCallback = callback;

            return self;
        };

        self.from = function(from) {
            if (typeof from !== "undefined") {
                self.data.from = from;
            }

            return self;
        };

        self.to = function(to) {
            if (typeof to !== "undefined") {
                self.data.to = to;
            }

            return self;
        };

        self.daysAgo = function(days) {
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

            self.data.from = yyyy + "-" + mm + "-" + dd;

            return self;
        };

        self.create = function(fields, success, failure, always) {
            var data = {};
            data[singular] = fields;

            $.post("/"+plural, data)
            .done(function(response) {
                if (typeof success === "function") {
                    success(response);
                }
            })
            .fail(function(error) {
                if (typeof failure === "function") {
                    failure(error);
                }
            })
            .always(function() {
                if (typeof always === "function") {
                    always();
                }
            });
        };

        self.destroy = function(id, success, failure, always) {
            $.ajax({url: "/"+plural+"/"+id, type: "DELETE"})
            .done(function(removedItem) {
                if (typeof success === "function") {
                    success(removedItem);
                }
            })
            .fail(function(error) {
                if (typeof failure === "function") {
                    failure(error);
                }
            })
            .always(function() {
                if (typeof always === "function") {
                    always();
                }
            });
        };
    };

    window.Cashular = { };

    window.Cashular.Transactions = function() {
        return new CashularRequest("transactions", "transaction");
    };

    window.Cashular.Envelopes = function() {
        return new CashularRequest("envelopes", "envelope");
    };
})();
