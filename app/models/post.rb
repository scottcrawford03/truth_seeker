class Post < ActiveRecord::Base
  belongs_to :category

  validates :lat, :long, presence: true

  def self.group_provider(category)
    category.posts.group_by { |post| post.provider }
  end
end
