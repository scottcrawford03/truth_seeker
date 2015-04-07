class TwitterController < ApplicationController
  attr_accessor :twitter_client

  def index
    @elvis = TwitterService.new.find_tag("bigfoot")
  end
end
