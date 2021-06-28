class AddDepthImgToHologram < ActiveRecord::Migration[5.2]
  def change
    add_column :holograms, :depth_img, :string
  end
end
