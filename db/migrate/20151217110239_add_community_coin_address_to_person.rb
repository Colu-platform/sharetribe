class AddCommunityCoinAddressToPerson < ActiveRecord::Migration
  def change
	  add_column :people, :community_coin_address, :string
  end
end
