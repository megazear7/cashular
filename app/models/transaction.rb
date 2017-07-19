class Transaction < ApplicationRecord
  belongs_to :envelope, optional: true
end
