class Hologram < ApplicationRecord
  belongs_to :user
  belongs_to :marker
  mount_uploader :video, MediaUploader
  mount_uploader :depth_img, MediaUploader
end
