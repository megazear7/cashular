Rails.application.routes.draw do
  devise_for :users

  authenticate :user do
    root to: 'application#main'

    resources :transactions, only: [ :index ] do
      collection do
        get 'unallocated'
      end
    end

    resources :envelopes, only: [ :index, :create, :destroy ] do
      member do
        post 'add_transaction/:transaction_id', action: :add_transaction
      end
    end
  end
end
