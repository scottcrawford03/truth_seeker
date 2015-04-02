Rails.application.routes.draw do
  root 'instagram#index'
  get '/twitter', to: 'twitter#index'
end
