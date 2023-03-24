#!/usr/bin/env bash

source .env

if [ -d dist ]; then
  rm -rf dist
fi

if [ ! -d dist ]; then
  mkdir dist
fi

cd ../frontend_admin
if [ ! -d node_modules ]; then
  pmpn install
fi
pnpm run build
tar -czvf ../docker/dist/frontend_admin_v${TAG}.tar.gz -C dist .
rm -rf dist
cd -

cd ../server_data
tar -czf ../docker/dist/server_data_v${TAG}.tar.gz init.sql *.sh
cd -

cd ../server_api
tar -czf ../docker/dist/server_api_v${TAG}.tar.gz --exclude='__pycache__' requirements.txt src
cd -

cd ../server_pycrawl
tar -czf ../docker/dist/server_py_v${TAG}.tar.gz --exclude='__pycache__' requirements.txt src
cd -
