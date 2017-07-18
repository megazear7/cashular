Rails.application.routes.draw do
  root to: 'application#main'

  resources :transactions, only: [ :index, :show ]
end
