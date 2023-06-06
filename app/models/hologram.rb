class Hologram < ApplicationRecord
  self.table_name = "holobo_holograms"
  belongs_to :user, foreign_key: "holobo_user_id"
  mount_uploader :video, MediaUploader
  mount_uploader :depth_img, MediaUploader

  def photo?
    ['jpg', 'jpeg', 'png'].include?(self.video.format)
  end

  def video?
    !self.photo?
  end

  def self.next_id
    1 + ActiveRecord::Base.connection.execute("select last_value from holobo_holograms_id_seq").first["last_value"]
  end
end
