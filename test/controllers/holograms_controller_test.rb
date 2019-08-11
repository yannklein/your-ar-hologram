require 'test_helper'

class HologramsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get holograms_index_url
    assert_response :success
  end

  test "should get show" do
    get holograms_show_url
    assert_response :success
  end

  test "should get new" do
    get holograms_new_url
    assert_response :success
  end

  test "should get create" do
    get holograms_create_url
    assert_response :success
  end

  test "should get edit" do
    get holograms_edit_url
    assert_response :success
  end

  test "should get update" do
    get holograms_update_url
    assert_response :success
  end

  test "should get delete" do
    get holograms_delete_url
    assert_response :success
  end

end
