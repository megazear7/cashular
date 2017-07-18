namespace :remove do
  
  # Example: rake import:csv[/path/to/csv]
  task :all, [:path] => [:environment] do |t, args|
    Transaction.delete_all
  end

end
