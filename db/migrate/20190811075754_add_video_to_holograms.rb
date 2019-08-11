class AddVideoToHolograms < ActiveRecord::Migration[5.2]
  def change
    add_column :holograms, :video, :string
  end
end
