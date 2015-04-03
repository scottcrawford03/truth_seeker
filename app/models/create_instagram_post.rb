class CreateInstagramPost
  attr_reader :service, :posts

  def initialize(service=InstagramService.new)
    @service = service
  end

  def find_all_posts
    []
  end

  def find_and_save_all_posts
    Tag.all.flat_map do |tag|
      service.find_posts_in_batches(tag.hashtag, &method(:save_posts_to_database))
    end
  end

  def save_posts_to_database(posts, tag)
    posts.each do |post|
      location = post['location'] || {}
      caption = post['caption'] || {'created_time' => 0}
      image = post['images'] || {'standard_resolution' => {}}
      Post.where(uuid: post['id'], provider: 'instagram').first_or_create(
        lat: location['latitude'],
        long: location['longitude'],
        posted_at: Time.at(caption['created_time'].to_i),
        text: caption['text'],
        image: image['standard_resolution']['url'],
        category_id: Tag.find_by(hashtag: tag).category_id,
      )
    end
  end
end
