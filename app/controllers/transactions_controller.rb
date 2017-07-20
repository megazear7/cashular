class TransactionsController < ApplicationController
#class TransactionsController < ActionController::API
  include Response
  include ExceptionHandler

  before_action :set_envelope
  before_action :set_from
  before_action :set_to
  before_action :set_page_size
  before_action :set_only_unorganized
  before_action :set_transactions

  def index
    if @only_unorganized
      @transactions.where!(envelope_id: nil)
    end

    json_response({
        transactions: @transactions.first(@page_size),
        count: @transactions.count,
        total: @transactions.sum(:amount)})
  end

  def unallocated
    json_response({
        payments: @transactions.where(envelope_id: nil).where("amount < 0").sum(:amount).abs,
        recieved: @transactions.where(envelope_id: nil).where("amount > 0").sum(:amount)})
  end

  private

  def set_envelope
    if params[:envelope_id]
      @envelope = Envelope.find(params[:envelope_id])
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
    @transactions = Transaction.all.order!('post_date DESC')

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
