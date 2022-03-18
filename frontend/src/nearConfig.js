import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js'
import getConfig from './nearNets'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract(store) {
  console.log(store, 'store 111')
  store.dispatch('setContractLoading', true)
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new WalletConnection(near)
  store.dispatch('setNearWalletConnection', walletConnection)
  store.dispatch('setAccountId', walletConnection.getAccountId())
  console.log(store.getters, 'getters')
  console.log(walletConnection.getAccountId(), 'walletConnection.getAccountId()')

  if (store.getters.getAccountId) {
    const acc = await near.account(store.getters.getAccountId)
    const balance = await acc.getAccountBalance()
    const amountInNEAR = utils.format.formatNearAmount(balance.total)
    store.dispatch('setNearBalance', amountInNEAR)
  }

  // Initializing our contract APIs by contract name and configuration
  const cotractSettings = await new Contract(walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_greeting', 'nft_total_supply', 'nft_supply_for_owner', 'nft_metadata', 'nft_token', 'nft_tokens_for_owner'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['set_greeting', 'nft_mint', 'nft_transfer', 'nft_transfer_call', 'nft_approve', 'nft_burn', 'nft_bundle', 'nft_unbundle'],
  })
  store.dispatch('setCurrentContract', cotractSettings)
}

export function logout(getCurrentWallet) {
  getCurrentWallet.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login(getCurrentWallet) {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  getCurrentWallet.requestSignIn(nearConfig.contractName)
}
