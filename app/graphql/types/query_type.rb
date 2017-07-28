require_relative "./envelope_type"

QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :envelope do
    type EnvelopeType
    argument :id, !types.ID
    argument :daysAgo, types.Int
    argument :from, types.String
    argument :to, types.String
    argument :organized, types.Boolean
    argument :deleted, types.Boolean
    description "Find a Envelope by ID"
    resolve ->(obj, args, ctx) {
      if Envelope.find(args[:id]).user.id != ctx[:current_user].id
        return nil
      end

      if args.key? :daysAgo
        ctx[:daysAgo] = args[:daysAgo]
      end

      if args.key? :from and not args.key?(:daysAgo)
        ctx[:from] = args[:from]
        puts ctx[:from]
      end

      if args.key? :to and not args.key?(:daysAgo)
        ctx[:to] = args[:to]
      end

      if args.key? :organized
        ctx[:organized] = args[:organized]
      end

      if args.key? :deleted
        ctx[:deleted] = args[:deleted]
      end

      Envelope.find(args["id"])
    }
  end

  field :user do
    type UserType
    argument :id, !types.ID
    argument :daysAgo, types.Int
    argument :from, types.String
    argument :to, types.String
    argument :organized, types.Boolean
    argument :deleted, types.Boolean
    description "Find a User by ID"
    resolve ->(obj, args, ctx) {
      if args[:id].to_i != ctx[:current_user].id
        return nil
      end

      if args.key? :daysAgo
        ctx[:daysAgo] = args[:daysAgo]
      end

      if args.key?(:from) and not args.key?(:daysAgo)
        ctx[:from] = args[:from]
      end

      if args.key?(:to) and not args.key?(:daysAgo)
        ctx[:to] = args[:to]
      end

      if args.key? :organized
        ctx[:organized] = args[:organized]
      end

      if args.key? :deleted
        ctx[:deleted] = args[:deleted]
      end

      User.find(args["id"])
    }
  end
end
