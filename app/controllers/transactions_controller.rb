class TransactionsController < ApplicationController
  include Response
  include ExceptionHandler

  before_action :set_transaction, only: [:destroy, :restore]

  def upload
    transactions = []
    params[:transactions].each do |index, transaction|
      transactions << Transaction.find_or_create_by!(
        user_id: current_user.id,
        description: transaction[:description],
        amount: transaction[:amount],
        post_date: Date.strptime(transaction[:post_date], "%m/%d/%Y")
      )
    end

    json_response(transactions)
  end

  def destroy
    @transaction.deleted = true
    @transaction.save

    json_response(@transaction)
  end

  def restore
    @transaction.deleted = false
    @transaction.save

    json_response(@transaction)
  end

  private

  def set_transaction
    @transaction = Transaction.where(user: current_user).find(params[:id])
  end
end
