class CreatePhrases < ActiveRecord::Migration[5.0]
  def change
    create_table :phrases do |t|
      t.string :phrase, required: true
      t.integer :envelope_id, required: true

      t.timestamps
    end
  end
end
