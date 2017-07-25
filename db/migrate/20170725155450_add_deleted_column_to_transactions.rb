class AddDeletedColumnToTransactions < ActiveRecord::Migration[5.0]
  def change
    add_column :transactions, :deleted, :boolean, default: false
  end
end
