class InstagramController < ApplicationController
  def index
    @all_elvis = CreateInstagramPost.new.find_all_posts
  end
end
