class Envelope < ApplicationRecord
  has_many :phrases
  has_many :transactions

  def sum from, to
    if ! from.nil? && ! to.nil?
      self.transactions.where("post_date >= ?", from).where("post_date <= ?", to).sum(:amount)
    elsif ! from.nil?
      self.transactions.where("post_date >= ?", from).sum(:amount)
    elsif ! to.nil?
      self.transactions.where("post_date <= ?", to).sum(:amount)
    else
      self.transactions.sum(:amount)
    end
  end
end
