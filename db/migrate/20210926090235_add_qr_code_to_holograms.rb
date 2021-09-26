class AddQrCodeToHolograms < ActiveRecord::Migration[5.2]
  def change
    add_column :holograms, :qr_code, :string
  end
end
