class InstagramService
  attr_reader :connection

  def initialize
    @connection = Faraday.new(url: "https://api.instagram.com/v1/")
  end

  def find_by_tag(tag)
    parse(connection.get("tags/#{tag}/media/recent",{access_token: ENV.fetch('instagram_access')}))
  end

  private

  def parse(response)
    JSON.parse(response.body)
  end
end
