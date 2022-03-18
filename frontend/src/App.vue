<template>
  <div id="root">
    <notifications group="foo" />

    <div v-if="getContractLoading" class="loading-container loading-container--app">
      <spinner :size="92" color="#000" />
    </div>

    <template v-else>

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

  mounted() {
    console.log(this.getContract2, 'contract')
  },

  beforeMount() {
    this.setIpfs()
    document.title = "nft-example.near_testing.testnet"
  },

  watch: {
    isSignedIn: {
      handler(value) {
        console.log(value, 'value')
        if (value) {
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