class CreateTransactions < ActiveRecord::Migration[5.0]
  def change
    create_table :transactions do |t|
      t.string :details
      t.date :post_date
      t.string :description
      t.float :amount
      t.string :t_type
      t.float :balance
      t.integer :check_number
      t.integer :envelope_id

      t.timestamps
    end
  end
end
