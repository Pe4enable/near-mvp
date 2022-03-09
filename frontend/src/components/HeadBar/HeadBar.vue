<template>
  <div class="headbar">
    <nav class="headbar__nav">
      <img src="../../assets/logo.jpg">
    </nav>
    <div class="headbar__acc">
      <div class="headbar__acc-info">Balance: <b>{{ accBalance }}</b> Near</div>
      <button class="error" style="float: right" @click="logout">Sign out</button>
    </div>
  </div>
</template>

<script>
import { logout } from "../../nearConfig"

export default {
  name: "HeadBar",
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

.headbar__nav a {
  position: relative;
  width: 33.333%;
  display: table-cell;
  text-align: center;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  padding: 10px 20px;
  transition: 0.2s ease color;
}

.headbar__nav a:before,
.headbar__nav a:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  transition: 0.2s ease transform;
}

.headbar__nav a:before {
  top: 0;
  left: 10px;
  width: 6px;
  height: 6px;
}

.headbar__nav a:after {
  top: 5px;
  left: 18px;
  width: 4px;
  height: 4px;
}

.headbar__nav a:nth-child(1):before {
  background-color: yellow;
}

.headbar__nav a:nth-child(1):after {
  background-color: red;
}

.headbar__nav a:nth-child(2):before {
  background-color: #00e2ff;
}

.headbar__nav a:nth-child(2):after {
  background-color: #89ff00;
}

.headbar__nav a:nth-child(3):before {
  background-color: purple;
}

.headbar__nav a:nth-child(3):after {
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

.headbar__nav a:hover {
  color: #fff;
}

.headbar__nav a:hover:before,
.headbar__nav a:hover:after {
  transform: scale(1);
}

.headbar__nav a.router-link-exact-active {
  text-decoration: underline;
}

.headbar__nav a.router-link-exact-active:before,
.headbar__nav a.router-link-exact-active:after {
  transform: scale(1);
}
</style>