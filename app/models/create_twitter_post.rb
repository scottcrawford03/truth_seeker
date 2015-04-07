class CreateTwitterPost
  attr_reader :service, :posts

  def initialize(service = TwitterService.new)
    @service = service
  end

  def find_all_posts
    []
  end

  def find_and_save_all_posts
    Tag.all.flat_map do |tag|
      service.find_tag(tag.hashtag, &method(:save_tweets_to_database))
    end
  end

  def save_tweets_to_database(posts, tag)
    posts.each do |tweet|
      unless tweet.geo.nil?
        image = tweet.media.first.media_url if tweet.media?
        Post.where(uuid: tweet.id, provider: "twitter").first_or_create(
          lat: tweet.geo.lat,
          long: tweet.geo.long,
          posted_at: tweet.created_at,
          text: tweet.text,
          image: image,
          category_id: Tag.find_by(hashtag: tag).category_id,
        )
      end
    end
  end
end
