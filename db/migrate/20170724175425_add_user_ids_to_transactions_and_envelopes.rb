class AddUserIdsToTransactionsAndEnvelopes < ActiveRecord::Migration[5.0]
  def change
    add_column :transactions, :user_id, :integer
    add_column :envelopes, :user_id, :integer
  end
end
