class RemoveQrcodeFromHolograms < ActiveRecord::Migration[5.2]
  def change
    remove_column :holograms, :qrcode, :string
  end
end
