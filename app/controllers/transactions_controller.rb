class TransactionsController < ApplicationController
  include Response
  include ExceptionHandler

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
end
