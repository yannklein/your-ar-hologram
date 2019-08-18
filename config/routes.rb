Rails.application.routes.draw do
  root to: 'holograms#index'

  resources :holograms
  get 'welcome', to: 'holograms#welcome', as: :welcome
  get 'holograms/:id/live', to: 'holograms#live', as: :live
  get 'holograms/:id/pattern.:format' => 'holograms#pattern'

  devise_for :users, :controllers => {:registrations => "registrations"}
  get ':user/', to: 'users#show', as: :user
end
