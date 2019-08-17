class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :holograms
  mount_uploader :picture, MediaUploader

  after_create :set_default_avatar
  validates :nickname, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  def set_default_avatar
    self.remote_picture_url = 'https://loremflickr.com/150/150/kitten' if self.picture.file.nil?
  end
end
