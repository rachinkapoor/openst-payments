#!/bin/bash
sh start_test_chain.sh
sh deploy_all.sh
. ./env_vars.sh
node ./../../migrations/create_tables.js
./../../node_modules/mocha/bin/mocha  ./../../mocha_test/services/pricer
./../../node_modules/mocha/bin/mocha  ./../../mocha_test/services/airdrop
# run worker test at last, as in the test case it removes the worker contract that is needed for other tests.
./../../node_modules/mocha/bin/mocha  ./../../mocha_test/services/workers