import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login'
import ChooseNFT from "../views/ChooseNFT"
import SendNFT from "../views/SendNFT"
const { providers } = require("near-api-js")
import store from "../store"
import { StatusType } from "../utilities"

const provider = new providers.JsonRpcProvider(
  "https://rpc.testnet.near.org"
)


Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Do[NFT]' },
    redirect: { name: 'ChooseNFT' },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Do[NFT]' },
  },
  {
    path: '/choose_nft',
    name: 'ChooseNFT',
    component: ChooseNFT,
    meta: { title: 'Do[NFT]', requiresAuth: true }
  },
  {
    path: '/send_nft',
    name: 'SendNFT',
    component: SendNFT,
    meta: { title: 'Do[NFT]', requiresAuth: true }
  },
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    from
    document.title = to.meta.title || process.env.NAME
  })
})

async function passResult(txHash, accountId, type) {
  const result = await provider.txStatus(txHash, accountId)

  if (result.status && 'SuccessValue' in result.status && type === 'send_nft') {
    console.log("Result: 2 ", result)
    store.dispatch('setStatus', StatusType.Approved)
  }

  if (result.status && 'SuccessValue' in result.status && type === 'choose_nft') {
    console.log("Result: 2 ", result)
    store.dispatch('setStatus', StatusType.Minted)
  }
}

// checking for auth require, depend on it, going to next route
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const user = window.walletConnection.isSignedIn()

  if (requiresAuth && !user) {
    next('/login')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: 'Please Sign in first',
    })
  } else {
    next()
  }

  // handling transaction hashes, for displayng response to user
  const account_id = window.accountId
  const url = new URL(document.location)
  const tx_hash = url.searchParams.get('transactionHashes')
  console.log("Result: 2 ", this)

  if (tx_hash && to.name === 'SendNFT') {
    router.push({ name: 'SendNFT' })
    passResult(tx_hash, account_id, 'send_nft')
  }
  if (tx_hash && to.name === 'ChooseNFT') {
    console.log(tx_hash, 'tx_hash')
    router.push({ name: 'ChooseNFT' })
    passResult(tx_hash, account_id, 'choose_nft')
  }
})

export default router