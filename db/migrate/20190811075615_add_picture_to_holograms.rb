class AddPictureToHolograms < ActiveRecord::Migration[5.2]
  def change
    add_column :holograms, :picture, :string
  end
end
