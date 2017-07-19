Rails.application.routes.draw do
  root to: 'application#main'

  resources :transactions, only: [ :index ]
  resources :envelopes, only: [ :index, :create, :destroy ]
end
