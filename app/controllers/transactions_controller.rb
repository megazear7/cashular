class TransactionsController < ApplicationController
#class TransactionsController < ActionController::API
  include Response
  include ExceptionHandler

  before_action :set_from
  before_action :set_to
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

    @transactions.order!('post_date DESC')
  end
end
