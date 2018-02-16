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
// Test: base.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const airdrop_utils                          = require('./airdrop_utils.js'),
      constructor                            = require('./constructor.js'),
      payAirdrop                             = require('./pay_airdrop.js');

contract('Airdrop', function(accounts) {
  describe('Constructor', async () => constructor.perform(accounts));
  describe('PayAirdrop', async () => payAirdrop.perform(accounts));
  after(async () => {
    airdrop_utils.utils.printGasStatistics();
    airdrop_utils.utils.clearReceipts();
  });
  
});