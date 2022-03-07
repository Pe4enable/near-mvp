import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import ChooseNFT from "../views/ChooseNFT"
import SendNFT from "../views/SendNFT"
// import ChooseEffect from "../views/ChooseEffect"
// import Minting from "../views/Minting"
// import WrapNFTS from "../views/WrapNFTS"
// import Unwrap from "../views/Unwrap"
const { providers } = require("near-api-js")
import store, { Status } from "../store"

const provider = new providers.JsonRpcProvider(
  "https://rpc.testnet.near.org"
)


Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Do[NFT]' }
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
//   {
//     path: '/wrap',
//     name: 'WrapNFTS',
//     component: WrapNFTS,
//     meta: { title: 'Do[NFT]' }
//   },
//   {
//     path: '/unwrap',
//     name: 'Unwrap',
//     component: Unwrap,
//     meta: { title: 'Do[NFT]' }
//   }
]

// if (process.env.VUE_APP_EFFECTS_ENABLED === 'true') {
//   routes.push(...[
//     {
//       path: '/choose_modification',
//       name: 'ChooseEffect',
//       component: ChooseEffect,
//       meta: { title: 'Do[NFT]' }
//     },
//     {
//       path: '/mint',
//       name: 'Minting',
//       component: Minting,
//       meta: { title: 'Do[NFT]' }
//     },
//   ])
// }

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    from
    document.title = to.meta.title || process.env.NAME
  })
})

async function passResult(txHash, accountId, type) {
  const result = await provider.txStatus(txHash, accountId)

  if (result.status && 'SuccessValue' in result.status && type === 'send_nft') {
    console.log("Result: 2 ", result)
    // store.dispatch.setStatus(Status.Approved)
    console.log(router, 'ROUTE')
    console.log(Status)
    store.dispatch('setStatus', Status.Approved)
  }

  if (result.status && 'SuccessValue' in result.status && type === 'choose_nft') {
    console.log("Result: 2 ", result)
    // store.dispatch.setStatus(Status.Approved)
    console.log(router, 'ROUTE')
    console.log(Status)
    store.dispatch('setStatus', Status.Minted)
  }
}

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const user = window.walletConnection.isSignedIn()

  if (requiresAuth && !user) {
    next('/')
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
  console.log(url, 'url')
  console.log(window.location.href, 'document.location')
  const tx_hash = url.searchParams.get('transactionHashes')

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