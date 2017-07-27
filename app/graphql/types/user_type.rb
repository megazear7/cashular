require_relative "./envelope_type"
require_relative "./transaction_type"

UserType = GraphQL::ObjectType.define do
  name "User"
  field :id, !types.ID
  field :email, types.String
  field :transactions, types[TransactionType]
  field :envelopes, types[EnvelopeType]
end
