class Post < ActiveRecord::Base
  belongs_to :author, class_name: "Member", :foreign_key => "author_id"
  has_and_belongs_to_many :teams

  enum restriction: [:everyone, :member, :limited, :admin]

  validates :restriction, presence: true

  validates :title, presence: true
  validates :description, presence: true
  validates :description_stripdown, length: { maximum: 250 }

  before_save :remove_useless_limited_teams
  before_save :process_description

  def self.valid_restrictions
    restrictions
  end

  def email_notification
    @email_notification ||= false
  end

  def email_notification=(val)
    if val.is_a? String
      val = (val =~ (/^(true|t|yes|y|1)$/i)) ? true : false
    else
      val = (val == true)
    end
    @email_notification = val
  end

  def add_limited_teams(teams)
    teams.each do |t|
      if team = Team.find_by(id: t.to_i)
        self.teams << team
      end
    end
  end

  def audience_description
    case self.restriction
    when "everyone"
      self.restriction.capitalize
    when "limited"
      teams_description = self.teams.all.order(:name).pluck(:name).join(', ')
      teams_description = "Limited (ADMIN ONLY)" if teams_description.blank?
      teams_description
    else
      self.restriction.pluralize.capitalize
    end
  end

  def process_description(force = false)
    if self.description_changed? || force
      self.description_markdown = MarkdownRender.render(self.description)
      self.description_stripdown = MarkdownRender.stripdown(self.description.truncate(240)).truncate(250, omission: '')
    end
  end

  private
  def remove_useless_limited_teams
    if self.restriction_changed? && self.restriction_was == "limited"
      self.teams.clear
    end
    true
  end
end
