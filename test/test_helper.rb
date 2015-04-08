require "simplecov"
SimpleCov.start "rails"
ENV["RAILS_ENV"] ||= "test"
require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"
require 'mocha/mini_test'
require "vcr"


class ActiveSupport::TestCase

  VCR.configure do |config|
    config.cassette_library_dir = 'test/vcr_cassettes'
    config.hook_into :faraday
  end

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
