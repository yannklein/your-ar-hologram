class Hologram < ApplicationRecord
  belongs_to :user
  mount_uploader :video, MediaUploader
end
