// Copyright 2018 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
// Test: airdrop_utils.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const Utils          = require('../../lib/utils.js'),
      BigNumber      = require('bignumber.js'),
      Workers        = artifacts.require('./Workers.sol'),
      Airdrop        = artifacts.require('./Airdrop.sol'),
      EIP20TokenMock = artifacts.require('./EIP20TokenMock.sol'),
      PriceOracle    = artifacts.require('./ost-price-oracle/PriceOracle.sol');

const ost = 'OST',
      usd = 'USD';

/// @dev Export common requires
module.exports.utils     = Utils;
module.exports.bigNumber = BigNumber;

/// @dev Export constants
module.exports.currencies = {
  ost : ost,
  usd : usd
}

/// @dev Deploy
module.exports.deployAirdrop = async (artifacts, accounts) => {

  const token               = await EIP20TokenMock.new(10, ost, 'name', 18),
        TOKEN_DECIMALS      = 18,
        opsAddress          = accounts[1],
        worker              = accounts[2],
        airdropBudgetHolder = accounts[3],
        workers             = await Workers.new(),
        airdrop             = await Airdrop.new(token.address, ost, workers.address, airdropBudgetHolder),
        usdPriceOracle      = await PriceOracle.new(ost, usd),
        usdPrice            = new BigNumber(20 * 10**18);

  assert.ok(await workers.setOpsAddress(opsAddress));
  assert.ok(await airdrop.setOpsAddress(opsAddress));
  assert.ok(await usdPriceOracle.setOpsAddress(opsAddress));

  assert.ok(await workers.setWorker(worker, web3.eth.blockNumber + 1000, { from: opsAddress }));
  assert.ok(await airdrop.setPriceOracle(usd, usdPriceOracle.address, { from: opsAddress }));
  assert.ok(await usdPriceOracle.setPrice(usdPrice, { from: opsAddress }));

	return {
    token          : token,
    airdrop        : airdrop,
    usdPriceOracle : usdPriceOracle
	};
};