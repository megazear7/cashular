namespace :export do
  def row *cells
    cells.map! { |cell| cell.to_s.sub(",", "") }
    cells.join(",") + "\r"
  end

  # Example usage: rake export:csv[1] > ../test.csv
  task :csv, [:id] => [:environment] do |t, args|
    user = User.find(args.id)
    csv = ""

    csv += row("Envelopes")
    csv += row("ID, Title")

    Envelope.where(user: user).each do |e|
      csv += row(e.id, e.title)
    end

    csv += row("")
    csv += row("Transactions")
    csv += row("ID", "Details", "Post Date", "Description", "Amount", "Type", "Balance", "Check Number", "Envelope ID")

    Transaction.where(user: user).each do |t|
      csv += row(t.id, t.details, t.post_date, t.description, t.amount, t.t_type, t.balance, t.check_number, t.envelope_id)
    end

    puts csv
  end
end
