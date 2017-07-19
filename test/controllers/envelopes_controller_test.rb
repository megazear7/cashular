require 'test_helper'

class EnvelopesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @envelope = envelopes(:one)
  end

  test "should get index" do
    get envelopes_url
    assert_response :success
  end

  test "should get new" do
    get new_envelope_url
    assert_response :success
  end

  test "should create envelope" do
    assert_difference('Envelope.count') do
      post envelopes_url, params: { envelope: { float: @envelope.float, string: @envelope.string } }
    end

    assert_redirected_to envelope_url(Envelope.last)
  end

  test "should show envelope" do
    get envelope_url(@envelope)
    assert_response :success
  end

  test "should get edit" do
    get edit_envelope_url(@envelope)
    assert_response :success
  end

  test "should update envelope" do
    patch envelope_url(@envelope), params: { envelope: { float: @envelope.float, string: @envelope.string } }
    assert_redirected_to envelope_url(@envelope)
  end

  test "should destroy envelope" do
    assert_difference('Envelope.count', -1) do
      delete envelope_url(@envelope)
    end

    assert_redirected_to envelopes_url
  end
end
