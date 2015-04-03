class AddUuidToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :uuid, :string
    add_index :posts, [:uuid, :provider], unique: true
  end
end
