namespace :import do

  def is_present cell
    if cell.is_a?(String)
      return (! cell.nil? and ! cell.strip.empty?)
    else
      return ! cell.nil?
    end
  end

  # Remove header row, remove old data, save as xls / xlsx
  # Example: rake import:xls[/path/to/xls]
  task :xls, [:path] => [:environment] do |t, args|
    book = Spreadsheet.open(args.path)

    book.worksheet(0).each do |row|
      if is_present(row[2]) and is_present(row[4]) and is_present(row[5])
        transaction = Transaction.find_or_initialize_by(
          details: row[1].nil? ? "No Details Available" : row[0],
          post_date: row[2],
          description: row[3].nil? ? "No Description Available" : row[2],
          amount: row[4],
          t_type: row[5].nil? ? "No Type Available" : row[4],
          balance: row[6],
          check_number: row[7].nil? ? -1 : row[6],
          envelope_id: row[8],
          user_id: 1
        )

        transaction.id = row[0];
        transaction.save
      end
    end

    book.worksheet(1).each do |row|
      envelope = Envelope.find_or_initialize_by(
        title: row[1],
        user_id: 1
      )
      envelope.id = row[0];
      envelope.save
    end
  end

end
