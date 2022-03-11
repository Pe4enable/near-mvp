import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login'
import ChooseNFT from "../views/ChooseNFT"
import SendNFT from "../views/SendNFT"
import CreateNFT from "../views/CreateNFT"
import AddEffect from "../views/AddEffect"
import AddEffectConfirm from "../views/AddEffectConfirm"
import NFTDetails from "../views/NFTDetails"
import store from "../store"
import { StatusType } from "../utilities"

const { providers } = require("near-api-js")
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
    path: '/create_nft',
    name: 'CreateNFT',
    component: CreateNFT,
    meta: { title: 'Do[NFT]', requiresAuth: true }
  },
  {
    path: '/add_effect/:id',
    name: 'AddEffect',
    component: AddEffect,
    meta: { title: 'Do[NFT]', requiresAuth: true },
  },
  {
    path: '/add_effect/:id/confirm/:effectId',
    name: 'AddEffectConfirm',
    component: AddEffectConfirm,
    meta: { title: 'Do[NFT]', requiresAuth: true }
  },
  {
    path: '/nft_details/:id',
    name: 'NFTDetails',
    component: NFTDetails,
    meta: { title: 'Do[NFT]', requiresAuth: true }
  },
  {
    path: '/send_nft/:id',
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

  console.log(result, 'tx HASH result')
  if (result.status && 'SuccessValue' in result.status && type === 'send_nft') {
    console.log("Result: 2 ", result)
    store.dispatch('setStatus', StatusType.Approved)
  }

  if (result.status && 'SuccessValue' in result.status && ['SendNFT', 'CreateNFT'].includes(type)) {
    console.log("Result: 2 ", result)
    store.dispatch('setStatus', StatusType.Minted)
  }
}

// checking for auth require, depend on it, going to next route
router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const user = window.walletConnection.isSignedIn()
  store.dispatch('setCurrentContract', window.contract)
  store.dispatch('setAccountId', window.accountId)

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
    await store.dispatch('getListOfNFT')
    console.log(to, 'to')
    const tokenIndex = store.getters.getAllNFTs.map((item) => item.token_id).indexOf(to.params.id)
    console.log(tokenIndex, 'tokenData')
    if (tokenIndex === -1) {
      router.push({ name: 'ChooseNFT' })
    } 
    passResult(tx_hash, account_id, to.name)
  }

  if (tx_hash && ['ChooseNFT', 'CreateNFT', 'AddEffect', 'AddEffectConfirm'].includes(to.name)) {
    console.log(tx_hash, 'tx HASH')
    router.push({ name: 'ChooseNFT' })
    passResult(tx_hash, account_id, to.name)
  }
  if (tx_hash && to.name === 'ChooseNFT') {
    console.log(tx_hash, 'tx_hash')
    router.push({ name: 'ChooseNFT' })
    passResult(tx_hash, account_id, 'choose_nft')
  }
})

export default router