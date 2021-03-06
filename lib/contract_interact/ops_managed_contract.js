"use strict";

/**
 * This is a utility file which would be used for executing all methods on OpsManaged Contract.<br><br>
 *
 * @module lib/contract_interact/ops_managed_contract
 */

const rootPrefix = '../..'
  , helper = require(rootPrefix + '/lib/contract_interact/helper')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , basicHelper = require(rootPrefix + '/helpers/basic_helper')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , web3RpcProvider = require(rootPrefix + '/lib/web3/providers/rpc')
  , notificationGlobalConstant = require(rootPrefix + '/lib/global_constant/notification')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , OwnedContract = require(rootPrefix + '/lib/contract_interact/owned_contract')
;

const contractName = 'opsManaged'
  , contractAbi = coreAddresses.getAbiForContract(contractName)
  , currContract = new web3RpcProvider.eth.Contract(contractAbi)
  , gasLimit = coreConstants.OST_GAS_LIMIT
;

/**
 * Ops managed contract interact constructor
 *
 * @param {string} contractAddress - address where Contract has been deployed
 * @param {string} defaultGasPrice - default Gas Price
 * @param {number} chainId - chain id
 *
 * @constructor
 * @augments OwnedContract
 *
 */
const OpsManagedContract = function (contractAddress, defaultGasPrice, chainId) {
  this.contractAddress = contractAddress;
  this.web3RpcProvider = web3RpcProvider;
  this.currContract = currContract;
  this.defaultGasPrice = defaultGasPrice;
  this.currContract.options.address = contractAddress;
  this.currContract.setProvider(web3RpcProvider.currentProvider);
  this.chainId = chainId;
  OwnedContract.call(this, contractAddress, web3RpcProvider, currContract, defaultGasPrice);
};

OpsManagedContract.prototype = Object.create(OwnedContract.prototype);

OpsManagedContract.prototype.constructor = OpsManagedContract;

/**
 * Get currContract's Ops Address
 *
 * @return {promise<result>}
 *
 */
OpsManagedContract.prototype.getOpsAddress = async function() {
  try {
    const transactionObject = this.currContract.methods.opsAddress()
      , encodedABI = transactionObject.encodeABI()
      , transactionOutputs = helper.getTransactionOutputs( transactionObject )
      , response = await helper.call(this.web3RpcProvider, this.contractAddress, encodedABI, {}, transactionOutputs);

    return Promise.resolve(response[0]);
  } catch(err) {
    logger.error('lib/contract_interact/ops_managed_contract.js:getOpsAddress inside catch:', err);
    return Promise.resolve(responseHelper.error('l_ci_omc_getOpsAddress_1', 'Something went wrong.'));
  }
};

/**
 * Set currContract's Ops Address
 *
 * @param {string} senderAddress - Sender Address
 * @param {String} senderPassphrase - Sender Passphrase
 * @param {String} opsAddress - address which is to be made Ops Address of currContract
 * @param {Object} options - options for this transaction
 *
 * @return {promise<result>}
 *
 */
OpsManagedContract.prototype.setOpsAddress = async function(senderAddress, senderPassphrase, opsAddress, options) {
  const oThis = this
  ;

  try {
    const returnType = basicHelper.getReturnType(options.returnType)
      , transactionObject = oThis.currContract.methods.setOpsAddress(opsAddress);

    const notificationData = helper.getNotificationData(
      ['payments.opsManaged.setOpsAddress'],
      notificationGlobalConstant.publisher(),
      'setOpsAddress',
      contractName,
      oThis.contractAddress,
      web3RpcProvider,
      oThis.chainId,
      options);

    const params = {
      transactionObject: transactionObject,
      notificationData: notificationData,
      senderAddress: senderAddress,
      senderPassphrase: senderPassphrase,
      contractAddress: oThis.contractAddress,
      gasPrice: oThis.defaultGasPrice,
      gasLimit: gasLimit,
      web3RpcProvider: web3RpcProvider,
      successCallback: null,
      failCallback: null,
      errorCode: "l_ci_omc_setOpsAddress_1"
    };

    return Promise.resolve(helper.performSend(params, returnType));
  } catch(err) {
    logger.error('lib/contract_interact/ops_managed_contract.js:setOpsAddress inside catch:', err);
    return Promise.resolve(responseHelper.error('l_ci_omc_setOpsAddress_2', 'Something went wrong.'));
  }
};

module.exports = OpsManagedContract;