require "test_helper"

class Api::V1::PostsControllerTest < ActionController::TestCase
  test "shows posts" do
    get :index, format: :json
    posts = JSON.parse(response.body)["posts"]
    first_post = posts.first
    post = Post.find(posts.first["id"])

    assert_response :success

    assert_equal 2, posts.count
    assert_equal post.id, first_post["id"]
    assert_equal post.provider, first_post["provider"]
    assert_equal post.image, first_post["image"]
    assert_equal post.lat, first_post["lat"]
    assert_equal post.text, first_post["text"]
    assert_equal post.category.name, first_post["category"]
    assert_equal post.posted_at, first_post["posted_at"]

    refute first_post["created_at"]
    refute first_post["updated_at"]
    refute first_post["uuid"]
  end

  test "shows posts with category id in params" do
    get :index, category_id: "980190962", format: :json
    posts = JSON.parse(response.body)["posts"]
    first_post = posts.first
    post = Post.find(posts.first["id"])

    assert_response :success

    assert_equal 2, posts.count
    assert_equal post.id, first_post["id"]
    assert_equal post.provider, first_post["provider"]
    assert_equal post.image, first_post["image"]
    assert_equal post.lat, first_post["lat"]
    assert_equal post.text, first_post["text"]
    assert_equal post.category.name, first_post["category"]
    assert_equal post.posted_at, first_post["posted_at"]

    refute first_post["created_at"]
    refute first_post["updated_at"]
    refute first_post["uuid"]
  end
end
