module QrHelper
	
	require 'rqrcode'

	def generate_qr(string)
		RQRCode::QRCode.new(string, :size => 6, :level => :h )		
	end	

end