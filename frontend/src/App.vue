<template>
  <div id="root">
    <notifications group="foo" />
    <nav-bar v-if="isSignedIn" />
    <router-view />
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

<style>
@import "./global.css";
</style>


<style lang="scss">
.vue-notification-group {
  width: 370px!important;
  top: 20px!important;
}

.vue-notification-group .vue-notification {
  padding: 10px;
  margin: 0 5px 5px;
  font-size: 18px;
  color: #ffffff;
  background: #44A4FC;
  border-left: 5px solid #187FE7;
  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }
  &.error {
    background: #E54D42;
    border-left-color: #B82E24;
  }
  &.success {
    background: #68CD86;
    border-left-color: #42A85F;
  }
}
</style>