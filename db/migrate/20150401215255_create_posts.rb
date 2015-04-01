class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :provider
      t.string :lat_lag
      t.string :image
      t.string :text
      t.datetime :posted_at
      t.references :category, index: true

      t.timestamps null: false
    end
    add_foreign_key :posts, :categories
  end
end
