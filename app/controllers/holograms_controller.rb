class HologramsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def index
    @holograms = Hologram.all
  end

  def show
    @hologram = Hologram.find(params['id'])
  end

  def live
    @hologram = Hologram.find(params['id'])
  end

  def new
    @restaurant = Restaurant.new
  end

  def create
    @restaurant = Restaurant.new(params[:restaurant])
    @restaurant.save
  end

  def edit
  end

  def update
  end

  def delete
  end
end
