class MediaUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave
end
