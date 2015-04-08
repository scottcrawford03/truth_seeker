class PostSerializer < ActiveModel::Serializer
  attributes :id, :provider, :image, :lat, :long, :text, :category, :posted_at

  def category
    Category.find(object.category_id).name
  end
end
