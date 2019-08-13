class Hologram < ApplicationRecord
  belongs_to :user
  mount_uploader :video, MediaUploader
  mount_uploader :qrcode, MediaUploader
  mount_uploader :picture, MediaUploader
  mount_uploader :marker, MediaUploader
end
