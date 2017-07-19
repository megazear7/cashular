class Envelope < ApplicationRecord
  has_many :phrases
  has_many :transactions

  def sum
    self.total = self.transactions.sum(:amount)
    self.save
  end
end
