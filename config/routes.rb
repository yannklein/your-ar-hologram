Rails.application.routes.draw do
  root to: 'holograms#index'

  resources :holograms
  get 'welcome', to: 'holograms#welcome', as: :welcome
  get 'holograms/:id/live', to: 'holograms#live', as: :live
  get 'holograms/:id/pattern.:format' => 'holograms#pattern'
  get 'holograms/:id/colorpick', to: 'holograms#color_pick', as: :color_pick
  patch 'holograms/:id/colorsave', to: 'holograms#color_save', as: :color_save

  resources :markers, only: [:index, :new, :create, :edit, :update]

  devise_for :users, :controllers => {:registrations => "registrations"}
  get ':user/', to: 'users#show', as: :user

end
