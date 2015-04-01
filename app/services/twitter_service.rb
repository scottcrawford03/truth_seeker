require 'tweetstream'

class TwitterService
  attr_accessor :twitter_client
  def initialize
    @twitter_client ||= Twitter::REST::Client.new do |config|
                          config.consumer_key        = ENV.fetch('twitter_client')
                          config.consumer_secret     = ENV.fetch('twitter_secret')
                        end

    @tweet_stream ||= TweetStream.configure do |config|
                        config.consumer_key        = ENV.fetch('twitter_client')
                        config.consumer_secret     = ENV.fetch('twitter_secret')
                        config.oauth_token         = ENV.fetch('twitter_access')
                        config.oauth_token_secret  = ENV.fetch('twitter_access_secret')
                        config.auth_method         = :oauth
                      end
  end

  def find_tag(tag)
    twitter_client.search(tag)
  end

  def track_tag(tag1,tag2)
    require 'pry' ; binding.pry
    TweetStream::Client.new.track(tag1,tag2) do |status|
      status.text
    end
  end
end
