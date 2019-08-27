class RemoveMarkerFromHologram < ActiveRecord::Migration[5.2]
  def change
    remove_column :holograms, :marker, :string
  end
end
