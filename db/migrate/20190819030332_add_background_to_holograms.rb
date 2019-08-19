class AddBackgroundToHolograms < ActiveRecord::Migration[5.2]
  def change
    add_column :holograms, :background, :string
  end
end
