require_relative "./envelope_type"
require_relative "./user_type"

TransactionType = GraphQL::ObjectType.define do
  name "Transaction"
  field :id, !types.ID
  field :post_date, types.String
  field :description, types.String
  field :amount, types.Float
  field :deleted, types.Boolean
  field :envelope do
    type EnvelopeType
    resolve -> (obj, args, ctx) {
      obj.envelope
    }
  end
  field :user do
    type UserType
    resolve -> (obj, args, ctx) {
      obj.user
    }
  end
end
