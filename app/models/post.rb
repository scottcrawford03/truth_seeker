class Post < ActiveRecord::Base
  belongs_to :category

  validates :lat, :long, presence: true
end
