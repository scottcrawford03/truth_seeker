require "test_helper"

class FakeRetriever
  attr_accessor :next_id
  attr_reader :called_urls
  def initialize(urls)
    @urls = urls
    @called_urls = []
  end

  def get(*args)
    called_urls << args[0]
    url = @urls.pop
    OpenStruct.new(body: {
      pagination: {
        next_url: url
      },
      data: [
        { id: next_id, tag: "my tag" }
      ]
    }.to_json)
  end
end

class TestInstagramService < ActiveSupport::TestCase
  test "uses the base url first and then the next url(s)" do
    fake = FakeRetriever.new ["https://nope.nope.com"]
    fake.next_id = 1
    service = InstagramService.new(fake)

    service.find_posts_in_batches("mytag") do |post_batch, tag|
      []
    end

    assert_equal fake.called_urls, ["", "https://nope.nope.com"]
  end

  test "find posts in batches yields batches of posts" do
    fake = FakeRetriever.new ["https://api.instagram.com/v1/"]
    fake.next_id = 1
    service = InstagramService.new(fake)
    find_called = false

    service.find_posts_in_batches("tag") do |post_batch, tag|
      find_called = true
      assert_equal "tag", tag

      assert_equal [{ "id" => 1, "tag" => "my tag" }], post_batch
      []
    end
    assert find_called
  end

  test "when there are only 33 posts, it returns those posts" do
    fake = FakeRetriever.new []
    fake.next_id = 1
    service = InstagramService.new(fake)
    find_called = false

    all_posts = service.find_posts_in_batches("tag") do |post_batch, tag|
      find_called = true
      assert_equal "tag", tag

      assert_equal [{ "id" => 1, "tag" => "my tag" }], post_batch
      []
    end
    assert find_called

    assert all_posts, [{ "id" => 1, "tag" => "my tag" }]
  end

  class TestInstagramService::Retriever < ActiveSupport::TestCase
    INITIAL_URL = "https://api.instagram.com/v1/tags/%<tag_name>s/media/recent"
    DEFAULT_HTTP_ARGS = { access_token: ENV.fetch("instagram_access"),
                          count: 33
                          }
    test "it constructs the correct URL when url is empty" do
      VCR.use_cassette("fetch_next_instagram_url") do
        service = InstagramService.new.http_retriever

        tag = "tag"
        url = ""
      result = JSON.parse(service.get(url, tag).body)
      assert_equal "https://api.instagram.com/v1/tags/tag/media/recent?" +
                   "access_token=#{ENV.fetch("instagram_access")}" +
                   "&count=33&max_tag_id=958737947548120985",
        result['pagination']['next_url']
      end
    end

    test "it contructs the correct URL when url is given" do
      VCR.use_cassette("fetch_next_instagram_url_with_url_given") do
        service = InstagramService.new.http_retriever

        tag = "tag"
        url = "https://api.instagram.com/v1/tags/tag/media/recent?" +
              "access_token=#{ENV.fetch("instagram_access")}" +
              "&count=33&max_tag_id=958737947548120985"
        result = JSON.parse(service.get(url, tag).body)
        assert_equal "https://api.instagram.com/v1/tags/tag/media/recent?" +
                     "access_token=#{ENV.fetch("instagram_access")}" +
                     "&count=33&max_tag_id=958736097706839061",
          result['pagination']['next_url']
      end
    end
  end
end
