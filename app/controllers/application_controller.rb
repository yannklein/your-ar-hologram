class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  force_ssl if: :ssl_configured?

  def configure_permitted_parameters
    # For additional fields in app/views/devise/registrations/new.html.erb
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :nickname, :picture, :bio])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :nickname, :picture, :bio])
  end

  def default_url_options
    { host: ENV["DOMAIN"] || "localhost:3000" }
  end

  def ssl_configured?
    !Rails.env.development?
  end
end
