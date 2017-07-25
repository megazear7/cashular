class EnvelopesController < ApplicationController
  include Response
  include ExceptionHandler

  protect_from_forgery prepend: true

  before_action :set_from
  before_action :set_to
  before_action :set_envelopes, only: [ :index ]
  before_action :set_envelope, only: [ :add_transaction, :destroy ]

  def index
    json_response(@envelopes)
  end

  def create
    @envelope = Envelope.create(envelope_params)

    @envelope.user = current_user
    @envelope.save

    json_response(@envelope)
  end

  def add_transaction
    @transaction = Transaction.where(user: current_user, deleted: false).find(params[:transaction_id])
    @envelope.transactions << @transaction

    json_response(@transaction)
  end

  def destroy
    @envelope.destroy

    json_response(@envelope)
  end

  private

  def set_from
    @from = params[:from]
  end

  def set_to
    @to = params[:to]
  end

  def set_envelopes
    @envelopes = [ ]
    Envelope.where(user: current_user).all.each do |envelope|
      @envelopes << {
        id: envelope.id,
        title: envelope.title,
        sum: envelope.sum(@from, @to)
      }
    end
    @envelopes
  end

  def set_envelope
    @envelope = Envelope.where(user: current_user).find(params[:id])
  end

  def envelope_params
    params.require(:envelope).permit(
      :title
    )
  end
end
