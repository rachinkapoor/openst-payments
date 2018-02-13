//"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on Pricer contract.<br><br>
 *
 * @module lib/contract_interact/pricer
 *
 */
const rootPrefix = '../..';
const helper = require(rootPrefix + '/lib/contract_interact/helper');
const coreAddresses = require(rootPrefix + '/config/core_addresses');
const web3RpcProvider = require(rootPrefix + '/lib/web3/providers/rpc');
const coreConstants = require(rootPrefix + '/config/core_constants');
const contractName = 'pricer';
const contractAbi = coreAddresses.getAbiForContract(contractName);
const GAS_LIMIT = coreConstants.OST_GAS_LIMIT;
const currContract = new web3RpcProvider.eth.Contract(contractAbi);
//const logger = require(rootPrefix + '/helpers/custom_console_logger');
const responseHelper = require(rootPrefix + '/lib/formatter/response');


/**
 * @constructor
 *
 */
const Pricer = module.exports = function (pricerAddress) {
  this.contractAddress = pricerAddress;
};

Pricer.prototype = {


  /**
  * Get branded token address of pricer
  *
  * @return {Promise}
  *
  */
  brandedToken: async function () {
    const transactionObject = currContract.methods.brandedToken();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodedABI, {}, transactionOutputs);
    return Promise.resolve(responseHelper.successWithData({brandedToken: response[0]}));
  },


  /**
  * Get acceptable margin for the given currency
  *
  * @param {string} currency - quote currency
  *
  * @return {Promise}
  *
  */
  acceptedMargins: async function (currency) {
    if (currency === undefined || currency === '' || currency === null) {
      return responseHelper.error('l_ci_p_am_1', 'currency is mandatory');
    }
    const transactionObject = currContract.methods.acceptedMargins(web3RpcProvider.utils.asciiToHex(currency));
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodedABI, {}, transactionOutputs);
    return Promise.resolve(responseHelper.successWithData({acceptedMargins: response[0]}));

  },


  /**
  * Get address of price oracle for the given currency
  *
  * @param {string} currency - quote currency
  *
  * @return {Promise}
  *
  */
  priceOracles: async function (currency) {
    if (currency === undefined || currency === '' || currency === null) {
      return responseHelper.error('l_ci_p_po_1', 'currency is mandatory');
    }
    const transactionObject = currContract.methods.priceOracles(web3RpcProvider.utils.asciiToHex(currency));
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodedABI, {}, transactionOutputs);
    return Promise.resolve(responseHelper.successWithData({priceOracles: response[0]}));
  },


  /**
  * Get base currency of pricer
  *
  * @return {Promise}
  *
  */
  baseCurrency: async function () {
    const transactionObject = currContract.methods.baseCurrency();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodedABI, {}, transactionOutputs);
    return Promise.resolve(responseHelper.successWithData({baseCurrency: response[0], symbol: web3RpcProvider.utils.hexToString(response[0])}));
  },


  /**
  * Get decimal of pricer
  *
  * @return {Promise}
  *
  */
  decimals: async function () {
    const transactionObject = currContract.methods.decimals();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodedABI, {}, transactionOutputs);
    return Promise.resolve(responseHelper.successWithData({decimals: response[0]}));
  },


  /**
  * Get conversion rate of pricer
  *
  * @return {Promise}
  *
  */
  conversionRate: async function () {
    const transactionObject = currContract.methods.conversionRate();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodedABI, {}, transactionOutputs);
    return Promise.resolve(responseHelper.successWithData({conversionRate: response[0]}));
  },


  /**
  * Set or updates the price oracle address for a given currency
  *
  * @param {string} senderAddr - address of sender
  * @param {string} senderPassphrase - passphrase of sender
  * @param {string} currency - quote currency
  * @param {string} address - address of price pracle
  * @param {BigNumber} gasPrice - gas price
  *
  * @return {Promise}
  *
  */
  setPriceOracle: function (senderAddress, senderPassphrase, currency, address, gasPrice) {

    if (currency === undefined || currency === '' || currency === null) {
      return responseHelper.error('l_ci_p_spo_1', 'currency is mandatory');
    }
    if (gasPrice === undefined || gasPrice === '' || gasPrice == 0  || gasPrice === null) {
      return responseHelper.error('l_ci_p_spo_2', 'gas is mandatory');
    }
    if (!helper.isAddressValid(address)) {
      return responseHelper.error('l_ci_p_spo_3', 'address is invalid'); 
    }
    if (!helper.isAddressValid(senderAddress)) {
      return responseHelper.error('l_ci_p_spo_4', 'address is invalid'); 
    }

    currContract.options.address = this.contractAddress;
    currContract.setProvider( web3RpcProvider.currentProvider );
    const transactionObject = currContract.methods.setPriceOracle(web3RpcProvider.utils.asciiToHex(currency), address);
    const encodedABI = transactionObject.encodeABI();
    return helper.sendTxAsyncFromAddr(
      web3RpcProvider,
      this.contractAddress,
      encodedABI,
      senderAddress,
      senderPassphrase,
      { gasPrice: gasPrice, gas: GAS_LIMIT }
    ).then(function(transactionHash) {
      return Promise.resolve(responseHelper.successWithData({transactionHash: transactionHash}));
    });
  },


  /**
  * Remove the price oracle address for a given currency
  *
  * @param {string} senderAddr - address of sender
  * @param {string} senderPassphrase - passphrase of sender
  * @param {string} currency - quote currency
  * @param {BigNumber} gasPrice - gas price
  *
  * @return {Promise}
  *
  */
  unsetPriceOracle: function (senderAddress, senderPassphrase, currency, gasPrice) {
    if (currency === undefined || currency === '' || currency === null) {
      return responseHelper.error('l_ci_p_uspo_1', 'currency is mandatory');
    }
    if (gasPrice === undefined || gasPrice === '' || gasPrice == 0  || gasPrice === null) {
      return responseHelper.error('l_ci_p_uspo_2', 'gas is mandatory');
    }
    if (!helper.isAddressValid(senderAddress)) {
      return responseHelper.error('l_ci_p_spo_3', 'address is invalid');
    }

    currContract.options.address = this.contractAddress;
    currContract.setProvider( web3RpcProvider.currentProvider );
    const transactionObject = currContract.methods.unsetPriceOracle(web3RpcProvider.utils.asciiToHex(currency));
    const encodedABI = transactionObject.encodeABI();
    return helper.sendTxAsyncFromAddr(
      web3RpcProvider,
      this.contractAddress,
      encodedABI,
      senderAddress,
      senderPassphrase,
      { gasPrice: gasPrice, gas: GAS_LIMIT }
    ).then(function(transactionHash) {
      return Promise.resolve(responseHelper.successWithData({transactionHash: transactionHash}));
    });
  },


  /**
  * Set or update the acceptable margin range for a given currency
  *
  * @param {string} senderAddr - address of sender
  * @param {string} senderPassphrase - passphrase of sender
  * @param {string} currency - quote currency
  * @param {BigNumber} acceptedMargin - accepted margin for the given currency (in wei)
  * @param {BigNumber} gasPrice - gas price
  *
  * @return {Promise}
  *
  */
  setAcceptedMargin:  function (senderAddress, senderPassphrase, currency, acceptedMargin, gasPrice) {

    if (currency === undefined || currency === '' || currency === null) {
      return responseHelper.error('l_ci_p_sam_1', 'currency is mandatory');
    }
    if (gasPrice === undefined || gasPrice === '' || gasPrice == 0  || gasPrice === null) {
      return responseHelper.error('l_ci_p_sam_2', 'gas price is mandatory');
    }
    if (acceptedMargin<0) {
      return responseHelper.error('l_ci_p_sam_3', 'accepted margin cannot be negetive');      
    }
    if (!helper.isAddressValid(senderAddress)) {
      return responseHelper.error('l_ci_p_sam_4', 'address is invalid'); 
    }

    const transactionObject = currContract.methods.setAcceptedMargin(web3RpcProvider.utils.asciiToHex(currency), acceptedMargin);
    const encodedABI = transactionObject.encodeABI();
    return helper.sendTxAsyncFromAddr(
      web3RpcProvider,
      this.contractAddress,
      encodedABI,
      senderAddress,
      senderPassphrase,
      { gasPrice: gasPrice, gas: GAS_LIMIT }
    ).then(function(transactionHash) {
      return Promise.resolve(responseHelper.successWithData({transactionHash: transactionHash}));
    });
  },


  /**
  * Pay
  *
  * @param {string} senderAddr - address of sender
  * @param {string} senderPassphrase - passphrase of sender
  * @param {string} beneficiaryAddress - address of beneficiary account
  * @param {BigNumber} transferAmount - transfer amount (in wei)
  * @param {string} commissionBeneficiaryAddress - address of commision beneficiary account
  * @param {BigNumber} commissionAmount - commission amount (in wei)
  * @param {string} currency - quote currency
  * @param {BigNumber} intendedPricePoint - price point at which the pay is intended (in wei)
  * @param {BigNumber} gasPrice - gas price
  *
  * @return {Promise}
  *
  */
  pay: function (
    senderAddress,
    senderPassphrase,
    beneficiaryAddress,
    transferAmount,
    commissionBeneficiaryAddress,
    commissionAmount,
    currency,
    intendedPricePoint,
    gasPrice) {

    if (gasPrice === undefined || gasPrice === '' || gasPrice == 0  || gasPrice === null) {
      return responseHelper.error('l_ci_p_p_1', 'gas price is mandatory');
    }
    if (transferAmount < 0) {
      return responseHelper.error('l_ci_p_p_2', 'transfer amount cannot be negetive');
    }
    if (commissionAmount < 0) {
      return responseHelper.error('l_ci_p_p_3', 'Commission amount cannot be negetive');
    }
    helper.assertAddress(senderAddress);
    if (transferAmount > 0 || (beneficiaryAddress !== undefined && beneficiaryAddress !== '')) {
      if (!helper.isAddressValid(beneficiaryAddress)) {
        return responseHelper.error('l_ci_p_p_3', 'address is invalid');
      }
    }
    if (commissionAmount > 0 || (commissionBeneficiaryAddress !== undefined && commissionBeneficiaryAddress !== '')) {
      if (!helper.isAddressValid(commissionBeneficiaryAddress)) {
        return responseHelper.error('l_ci_p_p_4', 'address is invalid');
      }
    }

    const transactionObject = currContract.methods.pay(
      beneficiaryAddress,
      transferAmount,
      commissionBeneficiaryAddress,
      commissionAmount,
      web3RpcProvider.utils.asciiToHex(currency),
      intendedPricePoint);

    const encodedABI = transactionObject.encodeABI();

    return helper.sendTxAsyncFromAddr(
      web3RpcProvider,
      this.contractAddress,
      encodedABI,
      senderAddress,
      senderPassphrase,
      { gasPrice: gasPrice, gas: GAS_LIMIT }
    ).then(function(transactionHash) {
      return Promise.resolve(responseHelper.successWithData({transactionHash: transactionHash}));
    });

  },


  /**
  * Get current price point from the price oracle for the give currency
  *
  * @param {string} currency - quote currency
  *
  * @return {Promise}
  *
  */
  getPricePoint: function (currency) {

    if (currency === undefined || currency === '' || currency === null) {
      return responseHelper.error('l_ci_p_gpp_1', 'currency is mandatory');
    }
    const transactionObject = currContract.methods.getPricePoint(web3RpcProvider.utils.asciiToHex(currency));
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    return helper.call(
      web3RpcProvider,
      this.contractAddress,
      encodedABI,
      {},
      transactionOutputs)
      .then(function(response) {
        return Promise.resolve(responseHelper.successWithData({pricePoint: response[0]}));
      })
      .catch(function(err) {
        return Promise.resolve(responseHelper.error("err_gpp_01", err));
      });

  },

  /**
  * Get current price point and calculated token amounts
  *
  * @param {BigNumber} transferAmount - transfer amount (in wei)
  * @param {BigNumber} commissionAmount - commision amount (in wei)
  * @param {string} currency - quote currency
  *
  * @return {Promise}
  *
  */
  getPricePointAndCalculatedAmounts: function (
    transferAmount,
    commissionAmount,
    currency) {

    if (currency === undefined || currency === '' || currency === null) {
      return responseHelper.error('l_ci_p_gppaca_1', 'currency is mandatory');
    }

    const transactionObject = currContract.methods.getPricePointAndCalculatedAmounts(transferAmount, commissionAmount, web3RpcProvider.utils.asciiToHex(currency));

    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    return helper.call(
      web3RpcProvider,
      this.contractAddress,
      encodedABI,
      {},
      transactionOutputs)
      .then(function (response) {
        return Promise.resolve(responseHelper.successWithData(
          {
            pricePoint: response[0],
            tokenAmount: response[1],
            commissionTokenAmount: response[2]
          }));
      });
  },


  /**
  * Convert value in wei
  *
  * @param {BigNumber} value - amount in decimal
  *
  * @return {BigNumer} 10^18
  *
  */
  toWei: function(value) {
    return web3RpcProvider.utils.toWei(value, "ether");
  },


  /**
  * Get transaction receipt from transaction hash
  *
  * @param {string} transactionHash - transaction hash
  *
  * @return {BigNumer} 10^18
  *
  */
  getTxReceipt: function(transactionHash) {

    if (transactionHash === undefined || transactionHash === '' || transactionHash === null) {
      return responseHelper.error('l_ci_p_gtr_1', 'transaction hash is mandatory');
    }

    return helper.getTxReceipt(
      web3RpcProvider,
      transactionHash,
      {})
      .then(function (transactionReceipt) {
        return Promise.resolve(responseHelper.successWithData({transactionReceipt: transactionReceipt}));
      });

  }

};
