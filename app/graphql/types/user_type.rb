require_relative "./envelope_type"
require_relative "./transaction_type"

def get_transactions transactions, args, ctx
  if not ctx[:daysAgo].nil?
    daysAgo = (Date.today - ctx[:daysAgo])
    transactions.where!("post_date >= ?", daysAgo)
  end

  if not ctx[:from].nil?
    transactions.where!("post_date >= ?", ctx[:from])
  end

  if not ctx[:to].nil?
    transactions.where!("post_date <= ?", ctx[:to])
  end

  if not ctx[:deleted].nil?
    transactions.where!(deleted: ctx[:deleted])
  else
    transactions.where!(deleted: false)
  end

  if not ctx[:organized].nil? and ctx[:organized]
    transactions = transactions.where.not(envelope_id: nil)
  elsif not ctx[:organized].nil? and not ctx[:organized]
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
end
