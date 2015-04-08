class Seed
  def initialize
    generate_categories
    generate_tags
  end

  def category_names
    ["Elvis", "Bigfoot", "UFO", "Ghost", "Tupac"]
  end

  def tag_data
    { 1 => ["elvissighting",
            "elvisisalive",
            "elvislives",
            "elvispresleylives",
            "elvisalive",
            "foundelvis"],
      2 => ["bigfootsighting",
            "bigfootisreal",
            "bigfootfound",
            "foundbigfoot",
            "squatchsighting",
            "squatchin"],
      3 => ["ufosighting",
            "realufo",
            "ufofound",
            "flyingsaucer",
            "aliensighting"],
      4 => ["ghostsighting",
            "ghosthunter",
            "haunted",
            "hauntedghost",
            "paranormalactivity"],
      5 => ["tupaclives",
            "tupacisalive",
            "foundtupac",
            "tupacalive"] }
  end

  def generate_categories
    category_names.each do |name|
      Category.create(name: name)
    end
  end

  def generate_tags
    tag_data.each do |category_id, tags|
      tags.each do |tag|
        Tag.create(hashtag: tag, category_id: category_id)
      end
    end
  end
end

Seed.new
