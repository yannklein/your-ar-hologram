class Hologram < ApplicationRecord
  belongs_to :user
  belongs_to :marker
  mount_uploader :video, MediaUploader
end
