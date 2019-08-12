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
  end

  def create
  end

  def edit
  end

  def update
  end

  def delete
  end
end
