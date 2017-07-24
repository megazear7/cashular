class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :envelope, optional: true
end
