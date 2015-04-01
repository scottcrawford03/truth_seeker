class InstagramController < ApplicationController
  def index
    @posts = InstagramService.new.find_by_tag('elivslives')
  end
end
