import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js'
import getConfig from './nearNets'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

console.log(nearConfig, 'nearConfig')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()
  const acc = await near.account(window.accountId)
  const balance = await acc.getAccountBalance()
  const amountInNEAR = utils.format.formatNearAmount(balance.total)
  window.balance = amountInNEAR

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_greeting', 'nft_total_supply', 'nft_supply_for_owner', 'nft_metadata', 'nft_token', 'nft_tokens_for_owner'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['set_greeting', 'nft_mint', 'nft_transfer', 'nft_transfer_call', 'nft_approve', 'nft_burn'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}