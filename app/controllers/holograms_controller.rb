# init barby & magick libraries
require 'barby'
require 'barby/barcode'
require 'barby/barcode/qr_code'
require 'barby/outputter/png_outputter'
require 'rmagick'

class HologramsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :pattern, :live, :show]
  # protect_from_forgery except: :show

  def index
    @holograms = Hologram.all.order("created_at DESC")
  end

  def welcome
    @holograms = Hologram.all.order("created_at DESC")
    @first_visit = true
    render :index
  end

  def show
    @hologram = Hologram.find(params['id'])
    @marker_png = create_marker(@hologram.marker.qrcode)
  end

  def live
    @hologram = Hologram.find(params['id'])
    @videoUrl = create_cloudinary_url(@hologram.video)
    @depthUrl = @hologram.depth_img.blank? ? nil : create_cloudinary_url(@hologram.depth_img)
  end

  def new
    @hologram = Hologram.new
    @hologram.marker = Marker.find(params[:marker_id])
  end

  def create
    # Get the previously created hologram
    @hologram = Hologram.find_by(marker_id: hologram_params[:marker_id])
    @hologram.assign_attributes(hologram_params)
    # if video is actually a iPhone portrait image try to create the depth
    if is_image?(@hologram)
      img_path = @hologram.video.path
      depth_img_url = Rails.root.join('public/depth_img.jpg')
      # depth_img_data = MiniExiftool.new('-b', img_path)
      system "exiftool -b -MPImage2 #{img_path} > #{depth_img_url}"
      src_file = File.new(depth_img_url)
      @hologram.depth_img = src_file
    end
    
    # @hologram.user = current_user
    if @hologram.save
      if is_image?(@hologram)
        redirect_to hologram_path(@hologram)
      else
        redirect_to color_pick_path(@hologram)
      end
    else
      render :new
    end
  end

  def is_image?(hologram)
    ['jpg', 'jpeg', 'png'].include?(hologram.video.format)
  end

  def color_pick
    @hologram = Hologram.find(params[:id])
    hologram_url = Cloudinary::Utils.cloudinary_url(@hologram.video, :format => :png)
    @hologram_base64 = "data:image/png;base64,#{Base64.encode64(open(hologram_url) { |io| io.read })}"
  end

  def color_save
    @hologram = Hologram.find(params[:id])
    @hologram.background = hologram_params[:background]
    @hologram.save
    redirect_to hologram_path(@hologram)
  end

  def edit
    @hologram = Hologram.find(params[:id])
  end

  def update
    @hologram = Hologram.find(params[:id])
    @hologram.marker = Marker.find(params[:id])
    @hologram.update(hologram_params)
    redirect_to hologram_path(@hologram)
  end

  def destroy
    @hologram = Hologram.find(params[:id])
    @hologram.destroy
    redirect_to user_path(current_user.nickname)
  end

  def pattern
    @hologram = Hologram.find(params[:id])
    render 'pattern'
  end

  private

  def create_cloudinary_url(media)
    baseURL = "https://res.cloudinary.com/yanninthesky/";
    "#{baseURL}#{media.identifier.split(/\//)[0..-3].concat(["h_720", media.identifier.split(/\//)[-1]]).join("/")}"
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

  def hologram_params
    params.require(:hologram).permit(:title, :description, :video, :qrcode, :background, :marker_id)
  end
end
