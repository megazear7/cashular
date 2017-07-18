namespace :import do

  def is_present cell
    if cell.is_a?(String)
      return (! cell.nil? and ! cell.strip.empty?)
    else
      return ! cell.nil?
    end
  end

  # Example: rake import:csv[/path/to/csv]
  task :csv, [:path] => [:environment] do |t, args|
    book = Spreadsheet.open(args.path)
    sheet = book.worksheet(0)

    sheet.each do |row|
        if is_present(row[1]) and is_present(row[3]) and is_present(row[5])
          Transaction.find_or_create_by(
            details: row[0].nil? ? "No Details Available" : row[0],
            post_date: row[1],
            description: row[2].nil? ? "No Description Available" : row[2],
            amount: row[3],
            t_type: row[4].nil? ? "No Type Available" : row[4],
            balance: row[5],
            check_number: row[6].nil? ? -1 : row[6])
        end
    end
  end

end
