class Post < ActiveRecord::Base
  belongs_to :category

  validates :lat, :long, presence: true

  scope :find_category, -> (name) { 
    joins(:category).where(categories: { name: name.downcase.titleize }) }
end
