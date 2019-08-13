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
    @hologram = Hologram.new
  end

  def create
    @hologram = Hologram.new(hologram_params)
    @hologram.save
  end

  def edit
  end

  def update
    @hologram = Hologram.find(params[:id])
    @hologram.update(hologram_params)
  end

  def delete
  end

  private

  def hologram_params
    params.require(:hologram).permit(:title, :description, :video, :picture, :qrcode)
  end
end
