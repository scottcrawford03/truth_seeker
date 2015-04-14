class Api::V1::PostsController < ApplicationController
  def index
    @posts = if params[:category_name]
      Post.find_category(params[:category_name])
    else
      Post.all
    end
    render json: @posts.limit(250).offset(params[:offset])
  end
end
