class CreateMarkers < ActiveRecord::Migration[5.2]
  def change
    create_table :markers do |t|
      t.string :qrcode
      t.string :pattern

      t.timestamps
    end
  end
end
