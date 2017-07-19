class CreateEnvelopes < ActiveRecord::Migration[5.0]
  def change
    create_table :envelopes do |t|
      t.string :title, required: true
      t.float :total, default: 0.0

      t.timestamps
    end
  end
end
