Rails.application.routes.draw do
  devise_for :users
  root to: 'holograms#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :holograms
  get 'holograms/:id/live', to: 'holograms#live', as: :live
  get 'holograms/:id/pattern.:format' => 'holograms#pattern'
end
