Rails.application.routes.draw do
  root 'instagram#index'
  get '/twitter', to: 'twitter#index'

  namespace :api do
    namespace :v1 do
      resources :posts
    end
  end
end
