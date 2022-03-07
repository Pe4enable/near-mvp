<template>
  <div class="navbar">
    <nav class="navbar__nav">
      <router-link :to="{ name: 'ChooseNFT'}">Create NFT</router-link>
      <router-link :to="{ name: 'SendNFT'}">Send NFT</router-link>
    </nav>
    <div class="navbar__acc">
      <div class="navbar__acc-info">Balance: <b>{{ accBalance }}</b> Near</div>
      <button class="error" style="float: right" @click="logout">Sign out</button>
    </div>
  </div>
</template>

<script>
import { logout } from "../../nearConfig"

export default {
  name: "NavBar",
  methods: {
    logout: logout,
  },

  computed: {
    accBalance() {
      return Number(window.balance).toFixed(2)
    },
  },
}
</script>

<style>
.navbar__acc {
  display: flex;
  align-items: center;
}

.navbar__acc-info {
  color: #fff;
  margin-right: 15px;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 0 15px;
  background: #000;
}

nav {
  width: 60%;
  margin-right: auto;
}

nav a {
  position: relative;
  width: 33.333%;
  display: table-cell;
  text-align: center;
  color: #ffffff;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
  padding: 10px 20px;
  transition: 0.2s ease color;
}

nav a:before,
nav a:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  transition: 0.2s ease transform;
}

nav a:before {
  top: 0;
  left: 10px;
  width: 6px;
  height: 6px;
}

nav a:after {
  top: 5px;
  left: 18px;
  width: 4px;
  height: 4px;
}

nav a:nth-child(1):before {
  background-color: yellow;
}

nav a:nth-child(1):after {
  background-color: red;
}

nav a:nth-child(2):before {
  background-color: #00e2ff;
}

nav a:nth-child(2):after {
  background-color: #89ff00;
}

nav a:nth-child(3):before {
  background-color: purple;
}

nav a:nth-child(3):after {
  background-color: palevioletred;
}

#indicator {
  position: absolute;
  left: 5%;
  bottom: 0;
  width: 30px;
  height: 3px;
  background-color: #fff;
  border-radius: 5px;
  transition: 0.2s ease left;
}

nav a:hover {
  color: #fff;
}

nav a:hover:before,
nav a:hover:after {
  transform: scale(1);
}

nav a.router-link-exact-active {
  text-decoration: underline;
}

nav a.router-link-exact-active:before,
nav a.router-link-exact-active:after {
  transform: scale(1);
}
</style>