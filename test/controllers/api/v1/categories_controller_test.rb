require "test_helper"

class Api::V1::CategoriesControllerTest < ActionController::TestCase
  test "#index" do
    get :index, format: :json

    categories = JSON.parse(response.body)["categories"]
    first_category = categories.first

    assert_response :success
    assert_equal "Elvis", first_category["name"]
    assert_equal "Evlis is alive!", first_category["description"]
    assert_equal ["elvislives"], first_category["tags"]["hashtags"]
  end
end
