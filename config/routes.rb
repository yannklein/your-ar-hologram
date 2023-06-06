Rails.application.routes.draw do
  root to: 'holograms#index'

  resources :holograms
  get 'welcome', to: 'holograms#welcome', as: :welcome
  get 'holograms/reset_qr_code_all', to: 'holograms#reset_qr_code_all', as: :reset_qr_code_all
  get 'holograms/:id/live', to: 'holograms#live', as: :live
  get 'holograms/:id/pattern.:format' => 'holograms#pattern'
  get 'holograms/:id/colorpick', to: 'holograms#color_pick', as: :color_pick
  get 'holograms/:id/reset_qr_code', to: 'holograms#reset_qr_code', as: :reset_qr_code
  patch 'holograms/:id/colorsave', to: 'holograms#color_save', as: :color_save


  devise_for :users, :controllers => {:registrations => "registrations"}
  get ':user/', to: 'users#show', as: :user

end
