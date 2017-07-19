class EnvelopesController < ApplicationController
  include Response
  include ExceptionHandler

  protect_from_forgery prepend: true

  before_action :set_envelopes, only: [ :index ]
  before_action :set_envelope, only: [ :add_transaction, :destroy ]

  def index
    json_response(@envelopes)
  end

  def create
    @envelope = Envelope.create(envelope_params)

    json_response(@envelope)
  end

  def add_transaction
    @transaction = Transaction.find(params[:transaction_id])
    @envelope.transactions << @transaction

    json_response(@transaction)
  end

  def destroy
    @envelope.destroy

    json_response(@envelope)
  end

  private

  def set_envelopes
    @envelopes = Envelope.all
  end

  def set_envelope
    @envelope = Envelope.find(params[:id])
  end

  def envelope_params
    params.require(:envelope).permit(
      :title
    )
  end
end
