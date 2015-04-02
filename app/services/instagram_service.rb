class InstagramService
  attr_reader :connection, :all_tags

  def initialize
    @connection = Faraday.new(url: "https://api.instagram.com/v1/")
    @all_tags = []
  end

  def find_by_tag(tag)
    parse(connection.get("tags/#{tag}/media/recent",{access_token: ENV.fetch('instagram_access'), count: 33 }))
  end

  def find_next_tags(url)
    conn = Faraday.new(url: url)
    parse(conn.get)
  end

  def find_all_by_tag(tag)
    data = find_by_tag(tag)
    next_url = data['pagination']['next_url']
    until next_url.nil?
      response = find_next_tags(next_url)
      @all_tags += response['data']
      next_url = response['pagination']['next_url']
    end
    all_tags
  end

  private

  def parse(response)
    JSON.parse(response.body)
  end
end
