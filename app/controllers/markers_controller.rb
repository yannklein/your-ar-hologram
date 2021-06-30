# init barby & magick libraries
require 'barby'
require 'barby/barcode'
require 'barby/barcode/qr_code'
require 'barby/outputter/png_outputter'
require 'rmagick'

class MarkersController < ApplicationController
  def index
    @markers = Marker.all
  end

  def new
    @marker = Marker.new

    # Prepare a new hologram to get an id ready
    @hologram = Hologram.new
    @hologram.user = current_user
    @hologram.marker = @marker
    @hologram.save

    @marker.qrcode = create_raw_qrcode(@hologram.id)
    
    @qrcode_png = to_png(@marker.qrcode)
    @marker_png = create_marker(@marker.qrcode)
  end

  def create
    @marker = Marker.new(marker_params)
    @marker.save
    redirect_to new_hologram_path(marker_id: @marker)
  end

  def edit
    @marker = Marker.find(params[:id])
    @new_id = params[:id]
    @marker.qrcode = create_raw_qrcode(@new_id)
    @qrcode_png = to_png(@marker.qrcode)
  end

  def update
    @marker = Marker.find(params[:id])
    @marker.update(marker_params)
    redirect_to new_hologram_path(marker_id: @marker)
  end

  private

  def create_raw_qrcode(new_holo_id)
    # Produce the hologram live url
    live_url = "#{root_url}/holograms/#{new_holo_id}/live"
    live_url = live_url.sub("http:", "https:")
    # Create the QR code PGN image
    barcode = Barby::QrCode.new(live_url, level: :q, size: 5)
    Base64.encode64(barcode.to_png(xdim: 5))
  end

  def to_png(raw_data)
    "data:image/png;base64,#{raw_data}"
  end

  def marker_params
    params.require(:marker).permit(:qrcode, :pattern)
  end

  def create_marker(raw_qrcode)
    # Create the marker containing the QR code
    # Load QR Code
    base_marker = Magick::Image.read_inline(raw_qrcode)
    base_marker = base_marker[0]

    white_margin = 0.07
    black_margin = 0.2

    base_marker.border!(512 * black_margin, 512 * black_margin, 'black')
    base_marker.border!(512 * white_margin, 512 * white_margin, 'white')

    full_image64 = Base64.encode64(base_marker.to_blob { |attrs| attrs.format = 'PNG' })
    "data:image/png;base64,#{full_image64}"
  end
end
