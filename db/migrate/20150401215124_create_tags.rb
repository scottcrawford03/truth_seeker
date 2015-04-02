class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :hashtag
      t.references :category, index: true

      t.timestamps null: false
    end
    add_foreign_key :tags, :categories
  end
end
