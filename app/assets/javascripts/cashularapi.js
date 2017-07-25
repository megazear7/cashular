(function() {
    CashularRequest = function(plural, singular) {
        var self = this;

        self.requestMade = false;
        self.path = "/"+plural;
        self.method = "GET"
        self.data = { };

        function makeRequest() {
            if (! self.requestMade) {
                self.requestMade = true;

                $.ajax({url: self.path,
                        data: self.data,
                        type: self.method})
                .done(function(response) {
                    if (typeof self.eachCallback === "function") {
                        $.each(response, function() {
                                self.eachCallback(this);
                        });
                    }

                    if (typeof self.allCallback === "function") {
                        self.allCallback(response);
                    }

                    if (typeof self.doneCallback === "function") {
                        self.doneCallback(response);
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

        self.onlyUnorganized = function() {
            self.data.onlyUnorganized = true;

            return self;
        };

        self.all = function(callback) {
            self.allCallback = callback;

            makeRequest();

            return self;
        };

        self.done = function(callback) {
            self.doneCallback = callback;

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
            self.data.from = Cashular.Utils.daysAgo(days);

            return self;
        };

        self.pageSize = function(count) {
            self.data.pageSize = count;

            return self;
        }

        self.create = function(fields, success, failure, always) {
            self.data[singular] = fields;
            self.method = "POST";

            makeRequest();

            return self;
        };

        self.destroy = function(id) {
            self.path += "/"+id;
            self.method = "DELETE";

            makeRequest();

            return self;
        };

        self.fromEnvelope = function(id) {
            self.data.envelope_id = id;

            return self;
        };

        self.unallocated = function() {
            self.path += "/unallocated";

            makeRequest();

            return self;
        };

        self.retrieveDeleted = function() {
            self.data.retrieveDeleted = true;

            return self;
        };
    };

    window.Cashular = window.Cashular || { };

    window.Cashular.Transactions = function() {
        return new CashularRequest("transactions", "transaction");
    };

    window.Cashular.Envelopes = function() {
        return new CashularRequest("envelopes", "envelope");
    };
})();
