module TestHelper
	
	def reverse_string_case(string)
		reversed=string
		i=0
		string.each_char do |char|		
			if char==char.upcase
				reversed[i]=char.downcase
			else
				reversed[i]=char.upcase
			end
			i+=1
		end
		reversed
	end

	def fake_email
		size=rand(3..6)			
		prefix=('a'..'z').to_a.shuffle[0..size].join
		suffix=('a'..'z').to_a.shuffle[0..size].join
		format=('a'..'z').to_a.shuffle[0..2].join
		"#{prefix}@#{suffix}.#{format}"				
	end
	def fake_url
		size=rand(3..6)			
		prefix=('a'..'z').to_a.shuffle[0..size].join
		suffix=('a'..'z').to_a.shuffle[0..size].join
		"http://www.#{prefix}.#{suffix}"				
	end	
	def fake_urls(number)
		(1..number).to_a.each_with_object([]) do |i,o| 
			o<<fake_url
		end.join(',')
	end
	def fake_emails(number)
		(1..number).to_a.each_with_object([]) do |i,o| 
			o<<fake_email
		end.join(',')
	end
	def fake_subject
		Faker::Lorem.sentence(1)
	end

	def fake_content
		Faker::Lorem.sentence(5)		
	end

	def fake_string(size=10)
		(0...size).map { ('a'..'z').to_a[rand(26)] }.join
	end

	def fake_txid
		Digest::SHA256.hexdigest fake_string
	end

end