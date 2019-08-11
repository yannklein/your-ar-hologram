class CreateHolograms < ActiveRecord::Migration[5.2]
  def change
    create_table :holograms do |t|
      t.string :title
      t.string :description
      t.string :qrcode
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
