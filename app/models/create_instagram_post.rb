class CreateInstagramPost
  attr_reader :service

  def initialize
    @service ||= InstagramService.new
    @posts = find_all_posts
  end

  def find_all_posts
    Tag.all.map do |tag|
      service.find_all_by_tag(tag.hashtag)
    end.flatten
  end
end
