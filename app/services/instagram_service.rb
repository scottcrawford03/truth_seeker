class InstagramService
  INITIAL_URL = "https://api.instagram.com/v1/tags/%<tag_name>s/media/recent"
  DEFAULT_HTTP_ARGS = { access_token: ENV.fetch("instagram_access"), count: 33 }
  attr_reader :http_retriever

  def initialize(http_retriever = Retriever.new)
    @http_retriever = http_retriever
  end

  def find_next_tags(tag, url)
    parse(http_retriever.get(url, tag))
  end

  def find_posts_in_batches(tag, &block)
    all_tags = []
    next_url = ""
    while next_url
      response = find_next_tags(tag, next_url)
      all_tags += block.call(response["data"], tag)
      next_url = response["pagination"]["next_url"]
    end
    all_tags
  end

  private

  def parse(response)
    JSON.parse(response.body)
  end

  class Retriever
    attr_reader :connector, :http_args
    def initialize(connector = Faraday, http_args = DEFAULT_HTTP_ARGS)
      @connector = connector
      @http_args = http_args
    end

    def get(url, tag)
      if url == ""
        uri = URI.parse(INITIAL_URL % { tag_name: tag })
        connector.new(url: "%s://%s" % [uri.scheme, uri.host]).
          get(uri.path, http_args)
      else
        connector.new(url: url).get
      end
    end
  end
end
