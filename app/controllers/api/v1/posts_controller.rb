class Api::V1::PostsController < ApplicationController
  def index
    if params[:category_id]
      render json: Post.where(category_id: params[:category_id])
    else
      render json: Post.all
    end
  end
end
