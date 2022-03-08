<template>
  <div id="root">
    <notifications group="foo" />
    <nav-bar v-if="isSignedIn" />

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar/NavBar.vue'
import getConfig from "./nearNets"
import { mapActions } from "vuex"

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
      this.setCurrentContract(window.contract)
      this.setAccountId(window.accountId)

      // getting all NFTs of currently signed user
      this.getListOfNFT()
    }
  },

  async beforeMount() {
    await this.setIpfs()
  },

  methods: {
    ...mapActions([
      'setCurrentContract',
      'setAccountId',
      'getListOfNFT',
      'setIpfs',
      'setStatus',
    ]),
  },

  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn()
    },
  },
}
</script>

<style lang="scss">
@import "./styles/app.scss";
</style>