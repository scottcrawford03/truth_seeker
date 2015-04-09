set :environment, "development"
set :output, {error: "log/cron_error_log.log", standard: "log/cron_log.log"}

every 12.hour do
  runner "puts 'Instagram Search Started'"
  runner "CreateInstagramPost.new.find_and_save_all_posts"
  runner "CreateTwitterPost.new.find_and_save_all_posts"
end
