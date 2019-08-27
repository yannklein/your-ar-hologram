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
    @new_id = Marker.last ? Marker.last.id + 1 : 1
    @marker.qrcode = create_raw_qrcode(@new_id)
    @qrcode_png = to_png(@marker.qrcode)
  end

  def create
    @marker = Marker.new(marker_params)
    @marker.save
    redirect_to markers_path
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
    redirect_to markers_path
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
end
