namespace :toolbelt do
  
  task :do, [:path] => [:environment] do |t, args|
    me = User.first

    Envelope.all.each do |envelope|
      envelope.user = me
      envelope.save
    end

    Transaction.all.each do |transaction|
      transaction.user = me
      transaction.save
    end
  end

end
