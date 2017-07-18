namespace :show do
  
  # Example: rake import:csv[/path/to/csv]
  task :all, [:path] => [:environment] do |t, args|
    Transaction.all.each do |transaction|
        puts(transaction.amount.to_s + "\t\t\t" + transaction.description)
    end
  end

end
