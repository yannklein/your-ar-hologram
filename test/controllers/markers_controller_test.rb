require 'test_helper'

class MarkersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get markers_index_url
    assert_response :success
  end

  test "should get new" do
    get markers_new_url
    assert_response :success
  end

  test "should get create" do
    get markers_create_url
    assert_response :success
  end

end
