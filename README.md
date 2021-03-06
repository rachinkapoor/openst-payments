# OpenST Payments - Advance Payment infrastructure on top of the [OpenST network](https://simpletoken.org)

[![Latest version](https://img.shields.io/npm/v/@openstfoundation/openst-payments.svg?maxAge=3600)](https://www.npmjs.com/package/@openstfoundation/openst-payments)
[![Travis](https://img.shields.io/travis/OpenSTFoundation/openst-payments.svg?maxAge=600)](https://travis-ci.org/OpenSTFoundation/openst-payments)
[![Downloads per month](https://img.shields.io/npm/dm/@openstfoundation/openst-payments.svg?maxAge=3600)](https://www.npmjs.com/package/@openstfoundation/openst-payments)
[![Gitter: JOIN CHAT](https://img.shields.io/badge/gitter-JOIN%20CHAT-brightgreen.svg)](https://gitter.im/OpenSTFoundation/SimpleToken)

While OpenST 0.9 is available as-is for anyone to use, we caution that this is early stage software and under heavy ongoing development and improvement. Please report bugs and suggested improvements.

# Install OpenST Payments

```bash
npm install @openstfoundation/openst-payments --save
```

# Run Test Chain

```bash
cd mocha_test/scripts/
sh start_test_chain.sh
```

# Set EVN Variables

### Setup Initial Setup Variables:

```bash
export OST_UTILITY_GETH_RPC_PROVIDER=''
export OST_UTILITY_DEPLOYER_ADDR=''
export OST_UTILITY_DEPLOYER_PASSPHRASE=''
export OST_UTILITY_OPS_ADDR=''
export OST_UTILITY_OPS_PASSPHRASE=''
```

### Deploy Branded Token Contract:

```bash
node tools/deploy/EIP20TokenMock.js conversionRate symbol name decimals gasPrice
```

### Deploy Workers Contract:

```bash
node tools/deploy/workers.js gasPrice chainId
```

### Deploy Airdrop Contract:

```bash
node tools/deploy/airdrop.js brandedTokenContractAddress baseCurrency workerContractAddress airdropBudgetHolder gasPrice chainId
```

### Set Caching Engine:

```bash
export OST_CACHING_ENGINE='none'
For using redis/memcache as cache engine refer - [OpenSTFoundation/ost-price-oracle](https://github.com/OpenSTFoundation/ost-price-oracle)
```

### Set DB Details For Payments/Airdrop:

```bash
export OP_MYSQL_HOST=''
export OP_MYSQL_USER=''
export OP_MYSQL_PASSWORD=''
export OP_MYSQL_DATABASE=''
export OP_MYSQL_CONNECTION_POOL_SIZE='5'
```

### Create Airdrop Tables:

```bash
node migrations/create_tables.js 
```

# Example:
```js
const OpenSTPayment = require('@openstfoundation/openst-payments')
  , deployer = new OpenSTPayment.deployer()
  , opsManaged = new OpenSTPayment.opsManaged(contractAddress, gasPrice, chainId)
  , workers = new OpenSTPayment.worker(workerContractAddress, chainId)
  , airdrop = new OpenSTPayment.airdrop(airdropContractAddress, chainId)
  , airdropManager = OpenSTPayment.airdropManager
;  
  // Deploy Contract
  deployer.deploy( contractName, constructorArgs, gasPrice, options);
  // Register Airdrop
  airdropManager.registerAirdrop(airdropContractAddress, chainId);
  // Set Ops Address
  opsManaged.setOpsAddress(deployerAddress, deployerPassphrase, opsAddress, options);
  // Set Worker
  workers.setWorker(senderAddress, senderPassphrase, workerAddress, deactivationHeight, gasPrice, options);
  // Set Price Oracle
  airdrop.setPriceOracle(senderAddress, senderPassphrase, currency, address, gasPrice, options);
  // Set Accepted Margin
  airdrop.setAcceptedMargin(senderAddress, senderPassphrase, currency, acceptedMargin, gasPrice, options);
  // Transfer Amount to airdrop budget holder
  airdropManager.transfer(senderAddress, senderPassphrase, airdropContractAddress, amount, gasPrice, chainId, options);
  // Approve airdrop budget holder
  airdropManager.approve(airdropContractAddress, airdropBudgetHolderPassphrase, gasPrice, chainId, options);
  // Allocate airdrop amount to users in batch
  airdropManager.batchAllocate(airdropContractAddress, transactionHash, airdropUsers, chainId);
  // Get Users Airdrop Balance
  airdropManager.getAirdropBalance(chainId, airdropContractAddress, userAddresses);
  // Call Pay method
  airdrop.pay(workerAddress,
              WorkerPassphrase,
              beneficiaryAddress,
              transferAmount,
              commissionBeneficiaryAddress,
              commissionAmount,
              currency,
              intendedPricePoint,
              spender,
              gasPrice,
              {tag:'airdrop.pay', returnType: 'txHash'});
```

For further implementation details, please refer to the [API documentation](https://openstfoundation.github.io/openst-payments/).