Rails.application.routes.draw do
  root to: 'application#main'

  resources :transactions, only: [ :index ]
  resources :envelopes, only: [ :index, :create, :destroy ] do
    member do
      post 'add_transaction/:transaction_id', action: :add_transaction
    end
  end
end
