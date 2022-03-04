<template>
  <div id="root">
    <nav-bar />
    <router-view />
  </div>
</template>

<script>
import "./global.css"
import NavBar from './components/NavBar.vue'
import getConfig from "./nearNets"

const nearConfig = getConfig(process.env.NODE_ENV || "development")
console.log(
  `networkId:${nearConfig.networkId} CONTRACT_NAME:${nearConfig.contractName}`
)
window.networkId = nearConfig.networkId

export default {
  name: "App",
  components: {
    NavBar,
  },

  created() {
    document.title = "nft-example.near_testing.testnet"

    if (this.isSignedIn) {
      this.$store.dispatch('setCurrentContract', window.contract)
      this.$store.dispatch('setAccountId', window.accountId)

      // getting all NFTs of currently signed user
      this.$store.dispatch('getListOfNFT')
    }
  },

  async beforeMount() {
    await this.$store.dispatch('setIpfs')
  },

  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn()
    },
  },
}
</script>

