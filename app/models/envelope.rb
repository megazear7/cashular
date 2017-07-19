class Envelope < ApplicationRecord
  has_many :phrases
  has_many :transactions

  def sum
    self.transactions.sum(:amount)
  end
end
