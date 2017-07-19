class EnvelopesController < ApplicationController
  include Response
  include ExceptionHandler

  protect_from_forgery prepend: true

  before_action :set_envelopes, only: [ :index ]
  before_action :set_envelope, only: [ :add_phrase, :destroy ]

  def index
    json_response(@envelopes)
  end

  def create
    @envelope = Envelope.create(envelope_params)

    json_response(@envelope)
  end

  def add_phrase
    @envelope.phrases.add(params[:phrase])
  end

  def destroy
    @envelope.destroy
  end

  private

  def set_envelopes
    @envelopes = Envelope.all
  end

  def set_envelope
    @envelope = Envelope.find(params[:envelope_id])
  end

  def envelope_params
    params.require(:envelope).permit(
      :title
    )
  end
end
