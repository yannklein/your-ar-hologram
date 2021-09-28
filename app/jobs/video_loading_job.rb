class VideoLoadingJob < ApplicationJob
  queue_as :default

  def perform(hologram, holo_url)
    if hologram.photo? # if holo is photo
      hologram.update(depth_img: create_depth_img(hologram))
    else # if video
      nobg_video_url = BackgroundRemoval.new(holo_url).remove_bg
      file = URI.open(nobg_video_url)
      hologram.update( video: file)
      # redirect_to color_pick_path(hologram)
    end
  end
end
