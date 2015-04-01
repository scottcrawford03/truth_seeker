class TwitterService
  attr_accessor :twitter_client
  def initialize
    @twitter_client ||= Twitter::REST::Client.new do |config|
                          config.consumer_key        = ENV.fetch('twitter_client')
                          config.consumer_secret     = ENV.fetch('twitter_secret')
                        end
  end

  def find_tag(tag)
    twitter_client.search(tag)
  end
end
