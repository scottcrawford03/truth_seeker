class Api::V1::PostsController < ApplicationController
  def index
    render json: Post.all
  end

  def show
    render json: Post.where(category_id: params['id'])
  end
end
