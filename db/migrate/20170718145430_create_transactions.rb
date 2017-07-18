class CreateTransactions < ActiveRecord::Migration[5.0]
  def change
    create_table :transactions, id: false do |t|
      t.string :details
      t.date :post_date
      t.string :description
      t.float :amount
      t.string :t_type
      t.float :balance
      t.integer :check_number

      t.timestamps
    end

    execute "ALTER TABLE transactions ADD PRIMARY KEY (details,post_date,description,amount,t_type,balance,check_number);"
  end
end
