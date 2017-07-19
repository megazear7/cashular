class TransactionsController < ApplicationController
#class TransactionsController < ActionController::API
  include Response
  include ExceptionHandler

  before_action :set_from
  before_action :set_to
  before_action :set_only_unorganized
  before_action :set_transactions

  def index
    json_response(@transactions)
  end

  private

  def set_from
    @from = params[:from]
  end

  def set_to
    @to = params[:to]
  end

  def set_only_unorganized
    @only_unorganized = params[:onlyUnorganized]
  end

  def set_transactions
    @transactions = Transaction.all

    if not @from.nil?
      # TODO Get this working
      @transactions.where!("post_date >= ?", @from)
    end

    if not @to.nil?
      # TODO Get this working
      @transactions.where!("post_date <= ?", @to)
    end

    if @only_unorganized
      @transactions.where!(envelope_id: nil)
    end

    @transactions.order!('post_date DESC')
  end
end
