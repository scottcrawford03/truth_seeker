class ChangeLatLongTable < ActiveRecord::Migration
  def change
    remove_column :posts, :lat_lag, :string
    add_column :posts, :lat, :string
    add_column :posts, :long, :string
  end
end
