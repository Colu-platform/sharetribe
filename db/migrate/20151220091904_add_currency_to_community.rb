class AddCurrencyToCommunity < ActiveRecord::Migration
  def change
    add_column :communities, :currency, :string
  end
end
