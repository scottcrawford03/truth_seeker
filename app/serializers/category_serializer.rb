class CategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :tags

  def tags
    { hashtags: object.tags.map {|tag| tag.hashtag }}
  end
end
