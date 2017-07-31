require_relative "./envelope_type"
require_relative "./transaction_type"

def get_transactions transactions, args, ctx
  if not ctx[:daysAgo].nil? and ctx[:daysAgo] != "undefined"
    daysAgo = (Date.today - ctx[:daysAgo])
    transactions.where!("post_date >= ?", daysAgo)
  end

  if not ctx[:from].nil? and ctx[:from] != "undefined"
    transactions.where!("post_date >= ?", ctx[:from])
  end

  if not ctx[:to].nil? and ctx[:to] != "undefined"
    transactions.where!("post_date <= ?", ctx[:to])
  end

  if not ctx[:deleted].nil? and ctx[:deleted] != "undefined"
    transactions.where!(deleted: ctx[:deleted])
  else
    transactions.where!(deleted: false)
  end

  if not ctx[:organized].nil? and ctx[:organized] != "undefined" and ctx[:organized]
    transactions = transactions.where.not(envelope_id: nil)
  elsif not ctx[:organized].nil? and ctx[:organized] != "undefined" and not ctx[:organized]
    transactions.where!(envelope_id: nil)
  end

  return transactions
end

UserType = GraphQL::ObjectType.define do
  name "User"
  field :id, !types.ID
  field :email, types.String
  field :transaction_count do
    type types.Int
    resolve -> (obj, args, ctx) {
      obj.transactions.count
    }
  end
  field :transactions do
    type types[TransactionType]
    argument :page, types.Int
    argument :perPage, types.Int
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
  field :envelopes, types[EnvelopeType]
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
end
