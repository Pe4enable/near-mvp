import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'

const config = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  contractName: process.env.VUE_APP_CONTRACT_NFTS_NAME,
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
}

const nearConfig = config

// Initialize contract & set global variables
export async function initContract2(store) {
  console.log(config, 'store 111')
  store.dispatch('setContractLoading', true)
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new WalletConnection(near)
  // store.dispatch('setNearWalletConnection', walletConnection)
  // store.dispatch('setAccountId', walletConnection.getAccountId())
  // console.log(store.getters, 'getters')
  // console.log(walletConnection.getAccountId(), 'walletConnection.getAccountId()')

  // if (store.getters.getAccountId) {
  //   const acc = await near.account(store.getters.getAccountId)
  //   const balance = await acc.getAccountBalance()
  //   const amountInNEAR = utils.format.formatNearAmount(balance.total)
  //   store.dispatch('setNearBalance', amountInNEAR)
  // }

  // Initializing our contract APIs by contract name and configuration
  const cotractSettings = await new Contract(walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_greeting', 'nft_total_supply', 'nft_supply_for_owner', 'nft_metadata', 'nft_token', 'nft_tokens_for_owner'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['set_greeting', 'nft_mint', 'nft_transfer', 'nft_transfer_call', 'nft_approve', 'nft_burn', 'nft_bundle'],
  })
  store.dispatch('setCurrentContract2', cotractSettings)
}