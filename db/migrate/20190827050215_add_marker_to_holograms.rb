class AddMarkerToHolograms < ActiveRecord::Migration[5.2]
  def change
    add_reference :holograms, :marker, foreign_key: true
  end
end
