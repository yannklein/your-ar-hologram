class AddMarkerPatternToHolograms < ActiveRecord::Migration[5.2]
  def change
    add_column :holograms, :marker_pattern, :string
  end
end
