<template>
  <main>
    <h1>Welcome to NEAR!</h1>
    <div class="home-text">
      <div class="home-text__inner">
        <p class="display-5">Use power of neural network algorithms to create new unique combinations of digital art</p>
        <p>Go ahead and click the button below to try it out:</p>
        <p style="text-align:center; margin-top:2.5em">
          <button v-on:click="login">Sign in</button>
        </p>
      </div>
      <img src="../assets/home_img.jpg" style="height: 30%;  border-radius:20%;" >
    </div>
  </main>
</template>

<script>
import { login } from "../nearConfig"

export default {
  name: "Home",

  methods: {
    login() {
      login()
    },
  },

  mounted() {
    if (window.walletConnection.isSignedIn()) {
      this.$router.push({name: 'ChooseNFT'})
    }
  }
}
</script>

<style>
.home-text {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.home-text__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
}

.home-text img {
  width: 30%;
  margin-left: 20px;
}
</style>