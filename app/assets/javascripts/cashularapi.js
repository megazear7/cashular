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

        self.fail = function(callback) {
            self.failCallback = callback;

            return self;
        };

        self.always = function(callback) {
            self.alwaysCallback = callback;

            return self;
        };

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

    };

    window.Cashular = window.Cashular || { };

    window.Cashular.API = function(query, callback) {
        $.post("graphql", {query: query})
        .success(function(result) {
            callback.bind(result.data)();
        });
    };

    window.Cashular.API.Transactions = function() {
        return new CashularRequest("transactions", "transaction");
    };

    window.Cashular.API.Transaction = { };

    window.Cashular.API.Transaction.destroy = function(transactionId) {
        return $.ajax({url: "/transactions/" + transactionId, method: "DELETE"});
    };

    window.Cashular.API.Transaction.restore = function(transactionId) {
        return $.ajax({url: "/transactions/" + transactionId + "/restore", method: "POST"});
    };

    window.Cashular.API.Transaction.organize = function(envelopeId, transactionId) {
        return $.post("/envelopes/" + envelopeId + "/add_transaction/" + transactionId);
    };

    window.Cashular.API.Envelopes = function() {
        return new CashularRequest("envelopes", "envelope");
    };

    window.Cashular.Query = function(query, variables, callback) {
        $.post("graphql", {query: query, variables: JSON.stringify(variables)})
        .success(function(result) {
            callback.bind(result.data)();
        });
    };

    window.Cashular.Queries = {

        UserTransactions: `query UserTransactions($id: ID!, $from: String, $to: String, $daysAgo: Int, $deleted: Boolean) {
        user(id: $id, from: $from, to: $to, daysAgo: $daysAgo, deleted: $deleted) {
          email
          transactions {
            id
            envelope_id
            description
            amount
            post_date
            deleted
          }
        }
      }`,

      UserEnvelopes: `query UserEnvelopes($id: ID!, $from: String, $to: String, $daysAgo: Int) {
        user(id: $id, from:$from, to: $to, daysAgo: $daysAgo) {
          gain
          loss
          count
          unallocated
          envelopes {
            id
            title
            net
            gain
            loss
            transactions {
              id
              envelope_id
              post_date
              description
              amount
              deleted
            }
          }
        }
      }`,

      Envelope: `query UserEnvelopes($id: ID!, $from: String, $to: String, $daysAgo: Int) {
        envelope(id: $id, from:$from, to: $to, daysAgo: $daysAgo) {
          transactions {
            id
            envelope_id
            post_date
            description
            amount
            deleted
          }
        }
      }`,

      CreateEnvelope: `query CreateEnvelope($id: ID!, $title: String!) {
        user(id: $id) {
          gain
          loss
          count
          unallocated
          createEnvelope(title: $title) {
            title
          }
          envelopes {
            id
            title
            net
            gain
            loss
            transactions {
              id
              envelope_id
              post_date
              description
              amount
              deleted
            }
          }
        }
      }`,

      DeleteEnvelope: `query DeleteEnvelope($userId: ID!, $envelopeId: ID!) {
        user(id: $userId) {
          gain
          loss
          count
          unallocated
          deleteEnvelope(id: $envelopeId) {
            title
          }
          envelopes {
            id
            title
            net
            gain
            loss
            transactions {
              id
              envelope_id
              post_date
              description
              amount
              deleted
            }
          }
        }
      }`,

      OrganizeTransaction: `query OrganizeTransaction($envelopeId: ID!, $transactionId: ID!) {
        envelope(id: $envelopeId) {
          id
          organizeTransaction(id: $transactionId) {
            id
            envelope_id
            post_date
            description
            amount
            deleted
          }
        }
      }`,

      DeleteTransaction: `query DeleteTransaction($transactionId: ID!) {
        transaction(id: $transactionId) {
          delete
          id
          envelope_id
          post_date
          description
          amount
          deleted
        }
      }`,

      RestoreTransaction: `query RestoreTransaction($transactionId: ID!) {
        transaction(id: $transactionId) {
          restore
          id
          envelope_id
          post_date
          description
          amount
          deleted
        }
      }`

    };

    $.each(window.Cashular.Queries, function(queryName, queryDefinition) {
        window.Cashular.Queries[queryName] = function(variables, callback) {
            window.Cashular.Query(queryDefinition, variables, callback);
        };
    });
})();
