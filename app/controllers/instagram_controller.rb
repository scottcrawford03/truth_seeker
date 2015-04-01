class InstagramController < ApplicationController
  def index
    @all_posts = InstagramService.new.find_all_tags('elvissighting')
  end
end
