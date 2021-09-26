require 'uri'
require 'net/http'

class BackgroundRemoval
  def initialize(url)
    @url = url
    @api_key = ENV['BG_REM_API_KEY']
    @api_url = "https://bgrem.deelvin.com/api"
  end

  def load_video
    url = URI("#{@api_url}/jobs/")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    # Add extension to tempfile
    video = URI.open(@url)
    video_with_ext = "#{video.path}.#{@url.split(".").last}"
    FileUtils.mv(video.path, video_with_ext)
    video = open(video_with_ext)

    request = Net::HTTP::Post.new(url)
    form_data = [['file', File.open(video)]]
    request.set_form form_data, 'multipart/form-data'
    response = https.request(request)
    content = JSON.parse(response.read_body)
    content['id']
  end

  def retrieve_nobg_video(id)
    url = URI("#{@api_url}/tasks/#{id}/")
    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    response = https.request(request)
    content = JSON.parse(response.read_body)
    if content["result_url"] 
      content["result_url"] 
    else
      puts 'not found, retry in 5sec..'
      p url
      sleep 5
      retrieve_nobg_video(id)
    end
  end

  def remove_bg

    job_id = load_video

    url = URI("#{@api_url}/tasks/")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Post.new(url)
    # request["Authorization"] = @api_key
    form_data = [['job', job_id ],['task_type', 'video'],['plan', 'start'],['bg_id', 'a899eb98-d66f-4517-a217-9602ea91f999']]
    request.set_form form_data, 'multipart/form-data'
    response = https.request(request)
    content = JSON.parse(response.read_body)
    retrieve_nobg_video(content['id'])
  end


end