class TwitterController < ApplicationController
  attr_accessor :twitter_client

  def index
    @user_name = 'scafa'
    @tweets = twitter_client.user_timeline(@user_name)
    @follower_count = twitter_client.user(@user_name).followers_count
    @elvis = twitter_client.search("#bigfoot -rt")
  end

  def twitter_client
    @twitter_client ||= Twitter::REST::Client.new do |config|
                          config.consumer_key        = ENV.fetch('twitter_client')
                          config.consumer_secret     = ENV.fetch('twitter_secret')
                        end
  end
end
