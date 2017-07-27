require_relative "./envelope_type"

QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :envelope do
    type EnvelopeType
    argument :id, !types.ID
    description "Find a Envelope by ID"
    resolve ->(obj, args, ctx) { Envelope.find(args["id"]) }
  end

  field :user do
    type UserType
    argument :id, !types.ID
    description "Find a User by ID"
    resolve ->(obj, args, ctx) { User.find(args["id"]) }
  end
end
