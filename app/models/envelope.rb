class Envelope < ApplicationRecord
  has_many :phrases
  has_many :transactions
end
