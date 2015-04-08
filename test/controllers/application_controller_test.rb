require 'test_helper'

class ApplicationControllerTest < ActionController::TestCase
  test '#index' do
    get :index, format: :json

    items      = JSON.parse(response.body)
    first_item = items.first

    assert_response :success
    assert_equal 'Cat',            first_item['name']
    assert_equal 'This is a cat.', first_item['description']
  end

  test "shows post data using VCR" do
  skip
    VCR.use_cassette("posts") do
      post :create, twitter_handle: "j3"
    end

    assert_response :success
    assert_not_nil assigns(:tweets)
    assert_select "li.tweet"
  end
end
