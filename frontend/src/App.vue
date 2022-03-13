<template>
  <div id="root">
    <notifications group="foo" />
    <head-bar v-if="isSignedIn" />

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeadBar from './components/HeadBar/HeadBar.vue'
import getConfig from "./nearNets"
import { mapActions, mapGetters } from "vuex"

const nearConfig = getConfig(process.env.NODE_ENV || "development")
console.log(
  `networkId:${nearConfig.networkId} CONTRACT_NAME:${nearConfig.contractName}`
)
window.networkId = nearConfig.networkId

export default {
  name: "App",

  components: {
    HeadBar,
  },

  computed: {
    ...mapGetters([
      'getCurrentWallet',
    ]),
    isSignedIn() {
      console.log(this.getCurrentWallet, 'current wallet')
      return this.getCurrentWallet.isSignedIn()
    },
  },

  created() {
    document.title = "nft-example.near_testing.testnet"

    if (this.isSignedIn) {
      // getting all NFTs of currently signed user
      this.getListOfNFT()
    }
  },

  async beforeMount() {
    await this.setIpfs()
  },

  methods: {
    ...mapActions([
      'getListOfNFT',
      'setIpfs',
    ]),
  },
}
</script>

<style lang="scss">
@import "./styles/app.scss";
</style>