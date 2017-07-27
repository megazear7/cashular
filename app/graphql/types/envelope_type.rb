require_relative "./transaction_type"
require_relative "./user_type"

EnvelopeType = GraphQL::ObjectType.define do
  name "Envelope"
  field :id, !types.ID
  field :title, types.String
  field :total, types.Float
  field :transactions, types[TransactionType]
  field :user do
    type UserType
    resolve -> (obj, args, ctx) {
      obj.user
    }
  end
  field :all_time do
    type types.Float
    argument :from, types.String
    argument :to, types.String
    resolve -> (obj, args, ctx) {
      obj.sum(args[:from], args[:to])
    }
  end
end
