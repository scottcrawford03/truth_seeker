class CategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :tags

  def tags
    { hashtags: object.tags.map(&:hashtag) }
  end
end
