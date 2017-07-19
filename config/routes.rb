Rails.application.routes.draw do
  resources :phrases
  resources :envelopes
  root to: 'application#main'

  resources :transactions, only: [ :index ]
  resources :envelopes, only: [ :index, :create, :destroy ]
end
