#!/bin/bash

BASE_APP='community-market';
APP_NAME='o-share-market';
CURRENCY_TICKER='OSH';
CURRENCY_SYMBOL='☯';
ASSET_ID='U6CvmvnoaGaW6A16LoGbtBYRHJXiJHHWX6j3e';
CURRENCY_NAME='o-share coin';
FB_CONNECT_ID='709331952537746';
FB_CONNECT_SECRET='7f063a1864e239e67ce1400b6715ee71';
HOMEPAGE_SEARCHBAR_BUFFER=150;
heroku fork --from $BASE_APP --to $APP_NAME;

heroku config:add -a $APP_NAME domain=$APP_NAME'.herokuapp.com' sharetribe_mail_from_address='admin@'$APP_NAME'.com' s3_bucket_name=$APP_NAME s3_upload_bucket_name=$APP_NAME'-upload' FOG_DIRECTORY=$APP_NAME currency_iso_code=$CURRENCY_TICKER currency_name=$CURRENCY_NAME currency_symbol=$CURRENCY_SYMBOL currency_asset_id=$ASSET_ID fb_connect_id=$FB_CONNECT_ID fb_connect_secret=$FB_CONNECT_SECRET homepage_searchbar_buffer=$HOMEPAGE_SEARCHBAR_BUFFER;

DB_CMD='heroku config:get CLEARDB_DATABASE_URL -a '$APP_NAME;

heroku config:set DATABASE_URL='mysql2://'$(echo $($DB_CMD) | cut -c 9-) -a $APP_NAME;

heroku run rake db:schema:load -a $APP_NAME;

heroku ps:scale worker=1 -a $APP_NAME;

heroku run rake assets:precompile -a $APP_NAME;
