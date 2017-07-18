class Transaction < ApplicationRecord
   set_primary_keys :details, :post_date, :description, :amount, :t_type, :balance, :check_number
end
