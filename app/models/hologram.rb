class Hologram < ApplicationRecord
  belongs_to :user
  mount_uploader :video, MediaUploader
  mount_uploader :depth_img, MediaUploader

  def photo?
    ['jpg', 'jpeg', 'png'].include?(self.video.format)
  end

  def video?
    !self.photo?
  end

  def self.next_id
    1 + ActiveRecord::Base.connection.execute("select last_value from holograms_id_seq").first["last_value"]
  end
end
