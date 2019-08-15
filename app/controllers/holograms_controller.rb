# init barby & magick libraries
require 'barby'
require 'barby/barcode'
require 'barby/barcode/qr_code'
require 'barby/outputter/png_outputter'
require 'RMagick'

class HologramsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :pattern]

  def index
    @holograms = Hologram.all
  end

  def show
    @hologram = Hologram.find(params['id'])
    @marker_png = create_marker(@hologram.qrcode)
  end

  def live
    @hologram = Hologram.find(params['id'])
  end

  def new
    @hologram = Hologram.new
    @new_id = Hologram.last ? Hologram.last.id + 1 : 1
    @hologram.qrcode = create_raw_qrcode(@new_id)
    @qrcode_png = to_png(@hologram.qrcode)
    @marker_png = create_marker(@hologram.qrcode)
  end

  def create
    @hologram = Hologram.new(hologram_params)
    @hologram.user = current_user
    @hologram.save
    redirect_to holograms_path
  end

  def edit
  end

  def update
    @hologram = Hologram.find(params[:id])
    @hologram.update(hologram_params)
  end

  def delete
  end

  def pattern
    @hologram = Hologram.find(params['id'])
    render 'pattern'
  end

  private

  def create_raw_qrcode(new_holo_id)
    # Produce the hologram live url
    live_url = "https://#{root_url}/holograms/#{new_holo_id}/live"
    # Create the QR code PGN image
    barcode = Barby::QrCode.new(live_url, level: :q, size: 5)
    Base64.encode64(barcode.to_png(xdim: 5))
  end

  def to_png(raw_data)
    "data:image/png;base64,#{raw_data}"
  end

  def create_marker(raw_qrcode)
    # Create the marker containing the QR code
    # Load QR Code
    base_marker = Magick::Image.read_inline(raw_qrcode)
    base_marker = base_marker[0]

    white_margin = 0.1
    black_margin = 0.2

    base_marker.border!(512 * black_margin, 512 * black_margin, 'black')
    base_marker.border!(512 * white_margin, 512 * white_margin, 'white')

    full_image64 = Base64.encode64(base_marker.to_blob { |attrs| attrs.format = 'PNG' })
    "data:image/png;base64,#{full_image64}"
  end

  def hologram_params
    params.require(:hologram).permit(:title, :description, :video, :qrcode, :marker)
  end
end
