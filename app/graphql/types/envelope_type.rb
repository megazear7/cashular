require_relative "./transaction_type"
require_relative "./user_type"

def get_transactions transactions, args, ctx
  if not ctx[:deleted].nil?
    transactions.where!(deleted: ctx[:deleted])
  else
    transactions.where!(deleted: false)
  end

  if not ctx[:from].nil?
    transactions.where!("post_date >= ?", ctx[:from])
  end

  if not ctx[:to].nil?
    transactions.where!("post_date <= ?", ctx[:to])
  end

  if not ctx[:organized].nil? and ctx[:organized]
    transactions = transactions.where.not(envelope_id: nil)
  elsif not ctx[:organized].nil? and not ctx[:organized]
    transactions.where!(envelope_id: nil)
  end

  return transactions
end

EnvelopeType = GraphQL::ObjectType.define do
  name "Envelope"
  field :id, !types.ID
  field :title, types.String
  field :transactions do
    type types[TransactionType]
    argument :from, types.String
    argument :to, types.String
    argument :deleted, types.String
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).order('post_date DESC')
    }
  end
  field :user do
    type UserType
    resolve -> (obj, args, ctx) {
      obj.user
    }
  end
  field :net do
    type types.Float
    argument :from, types.String
    argument :to, types.String
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).sum(:amount)
    }
  end
  field :loss do
    type types.Float
    argument :from, types.String
    argument :to, types.String
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).where("amount < ?", 0).sum(:amount).abs()
    }
  end
  field :gain do
    type types.Float
    argument :from, types.String
    argument :to, types.String
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).where("amount > ?", 0).sum(:amount)
    }
  end
end
