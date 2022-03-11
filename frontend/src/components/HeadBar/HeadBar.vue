<template>
  <div class="headbar">
    <nav class="headbar__nav">
      <router-link :to="{ name: 'ChooseNFT' }">
        <img src="../../assets/logo.jpg">
      </router-link>
    </nav>
    <div class="headbar__acc">
      <div class="headbar__acc-info">Balance: <b>{{ accBalance }}</b> Near</div>
      <a
        class="link"
        target="_blank"
        :href="`https://explorer.testnet.near.org/accounts/${getAccountId}`"
      >Wallet.near</a>
      <button class="main-btn main-btn--exit" style="float: right" @click="logout">Sign out</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from "../../nearConfig"

export default {
  name: "HeadBar",
  methods: {
    logout: logout,
  },

  computed: {
    ...mapGetters([
      'getAccountId',
    ]),
    accBalance() {
      return Number(window.balance).toFixed(2)
    },
  },
}
</script>

<style>
.headbar__acc {
  display: flex;
  align-items: center;
}

.headbar__acc-info {
  color: #fff;
  margin-right: 15px;
}

.headbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 0 15px;
  background: #2d0949;
}

.headbar__nav {
  width: 60%;
  margin-right: auto;
}

.headbar__nav a.router-link-exact-active {
  text-decoration: underline;
}

.headbar__nav a.router-link-exact-active:before,
.headbar__nav a.router-link-exact-active:after {
  transform: scale(1);
}
</style>