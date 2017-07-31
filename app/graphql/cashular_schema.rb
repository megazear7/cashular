require_relative "types/query_type"
require_relative "types/mutation_type"

CashularSchema = GraphQL::Schema.define do
  query(QueryType)
end
