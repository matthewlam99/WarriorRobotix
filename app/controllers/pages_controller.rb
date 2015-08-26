class PagesController < ApplicationController
  before_action :authenticate_admin!, only: [:attend]
  def home
    if member_signed_in?
      redirect_to posts_path
    end
  end
  def attend
    @checkedin = Array.new
    @checkedout = Array.new
    current_date = DateTime.now
    Attendance.order(start_at: :asc).each do |f|
      attendance_date = f.start_at
      if !f.start_at.nil? && f.end_at.nil?
        if attendance_date.day == current_date.day && attendance_date.month == current_date.month && attendance_date.year == current_date.year
          @checkedin.push(f)
        end
      end
      if !f.start_at.nil? && !f.end_at.nil?
        if attendance_date.day == current_date.day && attendance_date.month == current_date.month && attendance_date.year == current_date.year
          @checkedout.push(f)
        end
      end
    end
    @event_today = false
    @event_list = Array.new
    Post.all.each do |f|
      if f.type == "Event"
        if f.start_at.day == current_date.day && f.start_at.month == current_date.month && f.start_at.year == current_date.year
          @event_today = true
          @event_list.push(f)
        end
      end
    end
  end
end
