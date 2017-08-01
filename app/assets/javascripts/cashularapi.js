(function() {
    window.Cashular = window.Cashular || { };

    window.Cashular.Query = function(query, variables, callback) {
        $.post("graphql", {query: query, variables: JSON.stringify(variables)})
        .success(function(result) {
            callback.bind(result.data)();
        });
    };

    window.Cashular.Queries = {

      CashApp: `
        query CashApp($id: ID!, $from: String, $to: String, $daysAgo: Int, $deleted: Boolean, $organizerPage: Int, $fullTransactionsPage: Int, $explorerPage: Int) {
          user(id: $id, from: $from, to: $to, daysAgo: $daysAgo, deleted: $deleted) {
            ...userFields
            fullTransactionCount: transactionCount
            fullTransactions: transactions(page: $fullTransactionsPage) {
              ...transactionFields
            }
            organizerTransactionCount: transactionCount(organized: false)
            organizerTransactions: transactions(organized: false, page: $organizerPage) {
              ...transactionFields
            }
            envelopes {
              ...envelopeFields
              transactions(page: $explorerPage) {
                ...transactionFields
              }
            }
          }
        }
        fragment transactionFields on Transaction {
          id
          envelope_id
          description
          amount
          post_date
          deleted
        }
        fragment envelopeFields on Envelope {
          id
          transactionCount
          title
          net
          gain
          loss
        }
        fragment userFields on User {
          id
          email
          gain
          loss
          count
          unallocated
        }
      `,

      CreateEnvelope: `query CreateEnvelope($id: ID!, $title: String!) {
        user(id: $id) {
          createEnvelope(title: $title) {
            title
          }
        }
      }`,

      DeleteEnvelope: `query DeleteEnvelope($userId: ID!, $envelopeId: ID!) {
        user(id: $userId) {
          deleteEnvelope(id: $envelopeId) {
            title
          }
        }
      }`,

      OrganizeTransaction: `query OrganizeTransaction($envelopeId: ID!, $transactionId: ID!) {
        envelope(id: $envelopeId) {
          id
          organizeTransaction(id: $transactionId) {
            id
          }
        }
      }`,

      DeleteTransaction: `query DeleteTransaction($transactionId: ID!) {
        transaction(id: $transactionId) {
          delete
          id
        }
      }`,

      RestoreTransaction: `query RestoreTransaction($transactionId: ID!) {
        transaction(id: $transactionId) {
          restore
          id
        }
      }`

    };

    $.each(window.Cashular.Queries, function(queryName, queryDefinition) {
        window.Cashular.Queries[queryName] = function(variables, callback) {
            window.Cashular.Query(queryDefinition, variables, callback);
        };
    });
})();
