class PhrasesController < ApplicationController
  include Response
  include ExceptionHandler

  before_action :set_phrases

  def index
    json_response(@phrases)
  end

  private

  def set_phrases
    @phrases = Phrase.all
  end
end
