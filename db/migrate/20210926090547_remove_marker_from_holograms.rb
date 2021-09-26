class RemoveMarkerFromHolograms < ActiveRecord::Migration[5.2]
  def change
    remove_reference :holograms, :marker, foreign_key: true
  end
end
