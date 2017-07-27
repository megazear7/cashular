Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  devise_for :users

  authenticate :user do
    root to: 'application#main'

    post "/graphql", to: "graphql#execute"

    resources :transactions, only: [ :index, :destroy ] do
      member do
        post 'restore'
      end
      collection do
        post 'upload'
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
