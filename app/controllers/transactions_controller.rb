class TransactionsController < ApplicationController
  include Response
  include ExceptionHandler

  before_action :set_envelope, except: [:upload]
  before_action :set_from, except: [:upload]
  before_action :set_to, except: [:upload]
  before_action :set_page_size, except: [:upload]
  before_action :set_only_unorganized, except: [:upload]
  before_action :set_transactions, except: [:upload]
  before_action :set_transaction, only: [:destroy]

  def index
    if @only_unorganized
      @transactions.where!(envelope_id: nil)
    end

    json_response({
        transactions: @transactions.first(@page_size),
        count: @transactions.count,
        total: @transactions.sum(:amount)})
  end

  def upload
    params[:transactions].each do |index, transaction|
      Transaction.find_or_create_by!(
        user_id: current_user.id,
        description: transaction[:description],
        amount: transaction[:amount],
        post_date: transaction[:post_date])
    end

    redirect_to "/"
  end

  def destroy
    @transaction.deleted = true
    @transaction.save

    json_response(@transaction)
  end

  def unallocated
    json_response({
        payments: @transactions.where(envelope_id: nil).where("amount < 0").sum(:amount).abs,
        recieved: @transactions.where(envelope_id: nil).where("amount > 0").sum(:amount)})
  end

  private

  def set_envelope
    if params[:envelope_id]
      @envelope = Envelope.where(user: current_user).find(params[:envelope_id])
    end
  end

  def set_transaction
    if params[:id]
      @transaction = Transaction.where(user: current_user, deleted: false).find(params[:id])
    end
  end

  def set_from
    @from = params[:from]
  end

  def set_to
    @to = params[:to]
  end

  def set_page_size
    @page_size = params[:pageSize].to_i

    if @page_size.nil? || (! @page_size.nil? && @page_size <= 0)
        @page_size = 10
    end
  end

  def set_only_unorganized
    @only_unorganized = params[:onlyUnorganized]
  end

  def set_transactions
    @transactions = Transaction.where(user: current_user, deleted: false).order!('post_date DESC')

    if @envelope
      @transactions.where!({envelope_id: @envelope.id})
    end

    if not @from.nil?
      @transactions.where!("post_date >= ?", @from)
    end

    if not @to.nil?
      @transactions.where!("post_date <= ?", @to)
    end
  end
end
