class AddActiveToPaypalAccounts < ActiveRecord::Migration
  def change
    add_column :paypal_accounts, :active, :boolean
  end
end
