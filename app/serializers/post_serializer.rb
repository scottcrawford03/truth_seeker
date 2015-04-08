class PostSerializer < ActiveModel::Serializer
  attributes :id, :provider, :image, :lat, :long, :text, :category

  def category
    Category.find(object.category_id).name
  end
end
