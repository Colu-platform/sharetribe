#!/bin/bash

# get app name from cmd arg
BASE_APP='community-market';
APP_NAME='o-share-market';
CURRENCY_TICKER='OSH';
CURRENCY_SYMBOL='☯';
ASSET_ID='U6CvmvnoaGaW6A16LoGbtBYRHJXiJHHWX6j3e';
CURRENCY_NAME='o-share coin';

heroku fork --from $BASE_APP --to $APP_NAME;

heroku config:add -a $APP_NAME domain=$APP_NAME'.herokuapp.com' sharetribe_mail_from_address='admin@'$APP_NAME'.com' s3_bucket_name=$APP_NAME s3_upload_bucket_name=$APP_NAME'-upload' FOG_DIRECTORY=$APP_NAME currency_iso_code=$CURRENCY_TICKER currency_name=$CURRENCY_NAME currency_symbol=$CURRENCY_SYMBOL currency_asset_id=$ASSET_ID;

DB_CMD='heroku config:get CLEARDB_DATABASE_URL -a '$APP_NAME;

heroku config:set DATABASE_URL='mysql2://'$(echo $($DB_CMD) | cut -c 9-) -a $APP_NAME;

heroku run rake db:schema:load -a $APP_NAME;

heroku ps:scale worker=1 -a $APP_NAME;

heroku run rake assets:precompile -a $APP_NAME;
