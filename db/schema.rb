# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170718145430) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "transactions", primary_key: ["details", "post_date", "description", "amount", "t_type", "balance", "check_number"], force: :cascade do |t|
    t.string   "details",      null: false
    t.date     "post_date",    null: false
    t.string   "description",  null: false
    t.float    "amount",       null: false
    t.string   "t_type",       null: false
    t.float    "balance",      null: false
    t.integer  "check_number", null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

end
