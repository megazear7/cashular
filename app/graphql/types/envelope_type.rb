require_relative "./transaction_type"
require_relative "./user_type"

def get_transactions transactions, args, ctx
  if not args[:daysAgo].nil?
    daysAgo = (Date.today - args[:daysAgo])
    transactions.where!("post_date >= ?", daysAgo)
  elsif not ctx[:daysAgo].nil?
    daysAgo = (Date.today - ctx[:daysAgo])
    transactions.where!("post_date >= ?", daysAgo)
  end

  if not args[:from].nil?
    transactions.where!("post_date >= ?", args[:from])
  elsif not ctx[:from].nil?
    transactions.where!("post_date >= ?", ctx[:from])
  end

  if not args[:to].nil?
    transactions.where!("post_date <= ?", args[:to])
  elsif not ctx[:to].nil?
    transactions.where!("post_date <= ?", ctx[:to])
  end

  if not args[:deleted].nil?
    transactions.where!(deleted: args[:deleted])
  elsif not ctx[:deleted].nil?
    transactions.where!(deleted: ctx[:deleted])
  else
    transactions.where!(deleted: false)
  end

  if not args[:organized].nil? and args[:organized]
    transactions = transactions.where.not(envelope_id: nil)
  elsif not ctx[:organized].nil? and ctx[:organized]
    transactions = transactions.where.not(envelope_id: nil)
  elsif not args[:organized].nil? and not args[:organized]
    transactions.where!(envelope_id: nil)
  elsif not ctx[:organized].nil? and not ctx[:organized]
    transactions.where!(envelope_id: nil)
  end

  return transactions
end

EnvelopeType = GraphQL::ObjectType.define do
  name "Envelope"
  field :id, !types.ID
  field :title, types.String
  field :transactionCount do
    type types.Int
    argument :daysAgo, types.Int
    argument :from, types.String
    argument :to, types.String
    argument :organized, types.Boolean
    argument :deleted, types.Boolean
    resolve -> (obj, args, ctx) {
      get_transactions(obj.transactions, args, ctx).order('id').count
    }
  end
  field :transactions do
    type types[TransactionType]
    argument :page, types.Int
    argument :perPage, types.Int
    argument :daysAgo, types.Int
    argument :from, types.String
    argument :to, types.String
    argument :organized, types.Boolean
    argument :deleted, types.Boolean
    resolve -> (obj, args, ctx) {
      transactions = get_transactions(obj.transactions, args, ctx).order('post_date DESC, created_at DESC, id')

      per_page = 10
      if args.key? :perPage
        per_page = args[:perPage]
      end

      page = 1
      if args.key? :page
        page = args[:page]
      end

      transactions.paginate(page: page, per_page: per_page)
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
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).sum(:amount)
    }
  end
  field :loss do
    type types.Float
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).where("amount < 0").sum(:amount).abs
    }
  end
  field :gain do
    type types.Float
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).where("amount > 0").sum(:amount).abs
    }
  end
  field :count do
    type types.Int
    resolve -> (obj, args, ctx) {
      return get_transactions(obj.transactions, args, ctx).count
    }
  end
  field :unallocated do
    type types.Float
    resolve -> (obj, args, ctx) {
      transactions = get_transactions(obj.transactions, args, ctx)
      unallocated = transactions.where(envelope_id: nil).where("amount < 0").sum(:amount).abs +
                    transactions.where(envelope_id: nil).where("amount > 0").sum(:amount).abs
      return unallocated
    }
  end
  field :organizeTransaction do
    type TransactionType
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      transaction = Transaction.where(user: ctx[:current_user]).find(args[:id])
      obj.transactions << transaction
      return transaction
    }
  end

end
