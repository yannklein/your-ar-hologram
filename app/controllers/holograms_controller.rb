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
    @marker_png = create_marker(@hologram.qr_code)
  end

  def live
    @hologram = Hologram.find(params['id'])
    @videoUrl = create_cloudinary_url(@hologram.video)
    @depthUrl = @hologram.photo? ? create_cloudinary_url(@hologram.depth_img) : nil
  end

  def new
    @qr_code = create_raw_qrcode(Hologram.next_id)
    @hologram = Hologram.new(qr_code: @qr_code)
    @qrcode_png = to_png(@qr_code)
  end

  def reset_qr_code
    @hologram = Hologram.find(params['id'])
    @qr_code = create_raw_qrcode(@hologram.id)
    if @hologram.update(qr_code: @qr_code)
      redirect_to hologram_path(@hologram)
    end
  end

  def reset_qr_code_all
    holograms = Hologram.all
    holograms.each do |holo|
      qr_code = create_raw_qrcode(holo.id)
      holo.update(qr_code: qr_code)
    end
    redirect_to holograms_path
  end
  
  def create
    @hologram = Hologram.new(hologram_params)
    @hologram.user = current_user
    if @hologram.save
      if @hologram.photo? # if holo is photo
        @hologram.update(depth_img: create_depth_img(@hologram))
      else # if video
        VideoLoadingJob.perform_later(@hologram, @hologram.video.metadata["secure_url"])
        # redirect_to color_pick_path(@hologram)
      end
      redirect_to hologram_path(@hologram)
    else
      render :new
    end
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
    @qr_code = create_raw_qrcode(@hologram.id)
    @qrcode_png = to_png(@qr_code)
  end

  def update
    @hologram = Hologram.find(params[:id])
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

  def create_depth_img(hologram)
    # img_path = hologram.video.path # for some reasons video.path is not a thing anymore :(
    img_path = hologram.video.metadata["secure_url"]
    depth_img_url = Rails.root.join('public/depth_img.jpg')
    # depth_img_data = MiniExiftool.new('-b', img_path)
    system "exiftool -b -MPImage2 #{img_path} > #{depth_img_url}"
    File.new(depth_img_url)
  end

  def create_cloudinary_url(media)
    baseURL = "https://res.cloudinary.com/yanninthesky/";
    "#{baseURL}#{media.identifier.split(/\//)[0..-3].concat(["h_720", media.identifier.split(/\//)[-1]]).join("/")}"
  end

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
    params.require(:hologram).permit(:title, :description, :video, :background, :qr_code, :marker_pattern)
  end
end
