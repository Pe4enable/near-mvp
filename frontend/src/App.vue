<template>
  <div id="root">
    <div v-if="getContractLoading" class="loading-container loading-container--app">
      <spinner :size="92" color="#000" />
    </div>
    <template v-else>
      <notifications group="foo" />
      <head-bar
        v-if="isSignedIn"
      />

      <div class="container">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script>
import HeadBar from './components/HeadBar/HeadBar.vue'
import Spinner from "./components/Spinner"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "App",

  components: {
    HeadBar,
    Spinner,
  },

  computed: {
    ...mapGetters([
      'getCurrentWallet',
      'getContractLoading',
      'getContract'
    ]),
    // checking for wallet and contract, until they loaded
    isSignedIn() {
      if (this.getCurrentWallet && this.getContract) {
        return this.getCurrentWallet.isSignedIn()
      }

      return false
    },
  },

  beforeMount() {
    this.setIpfs()
    document.title = "nft-example.near_testing.testnet"
  },

  watch: {
    isSignedIn: {
      handler(value) {
        if (value) {
          console.log(this.getCurrentWallet, 'this.getCurrentWallet')
          // getting all NFTs of currently signed user
          this.getListOfNFT()
        }
      },
    },
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