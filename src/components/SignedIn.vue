<template>
  <div>
    <button class="link" style="float: right" v-on:click="logout">Sign out</button>
    <main>
      <h1>Create new NFT</h1>
      <form class="form-nft" @submit.prevent="createNft">
        <input
          type="text"
          placeholder="token ID"
          class="input form-nft__input"
          v-model="nftObj.token_id"
        >
        <input
          type="text"
          placeholder="NFT title"
          class="input form-nft__input"
          v-model="nftObj.metadata.title"
        >
        <input
          type="text"
          placeholder="NFT description"
          class="input form-nft__input"
          v-model="nftObj.metadata.description"
        >
        <input
          type="text"
          placeholder="NFT media"
          class="input form-nft__input"
          v-model="nftObj.metadata.media"
        >
        <button class="btn-main" type="submit">Submit</button>
      </form>
      <h1 class="h1--no-logo">{{accountId}} account NFTs</h1>
      <div class="nft-cards">
        <div class="nft-cards__item" v-for="(item, key) in nftArray" :key="key">
          <img :src="item.metadata.media" class="nft-cards__media">
        </div>
      </div>
      <h1 class="h1--no-logo">NFT effects</h1>

      <div class="effect-cards">
        <effect-cards
          @cardClicked="chooseEffect"
          content-type="video"
          :show-id="false"
          :cards="getEffects"
          :choice="[getEffectChoice]"
        ></effect-cards>
        <button class="btn-main" @click="handleMint">Submit</button>
      </div>
    </main>

    <Notification
      v-show="notificationVisible"
      ref="notification"
      :networkId="networkId"
      :msg="'called method: setGreeting'"
      :contractId="contractId"
      :visible="false"
    />
  </div>
</template>

<script>
import EffectCards from "./EffectCards"
import { logout } from "../utils"
import { mapGetters } from "vuex"

import Notification from "./Notification.vue"

export default {
  name: "SignedIn",

  async mounted() {
    this.getNftTotal()
    this.nftMetadata()
    this.nftTokendata()
    this.nftTokensForOwner()
    await this.$store.dispatch("setEffects")
  },

  components: {
    Notification,
    EffectCards,
  },

  data: function () {
    return {
      nftObj: {
        token_id: 'token-2',
        metadata: {
          title: 'NFT token 2 title',
          description: 'NFT token 2 description',
          media: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/VitalikButerinProfile.jpg/1200px-VitalikButerinProfile.jpg',
        },
        receiver_id: '',
      },
      savedGreeting: "",
      newGreeting: "",
      notificationVisible: false,
      nftArray: [],
    }
  },

  computed: {
    ...mapGetters([
      'getEffectChoice',
      'getEffects',
      'getDeployedPictureMeta',
    ]),
    isSignedIn() {
      return window.walletConnection ? window.walletConnection.isSignedIn(): false
    },
    accountId() {
      return window.accountId
    },
    contractId() {
      return window.contract ? window.contract.contractId: null
    },
    networkId() {
      return window.networkId
    },
  },

  methods: {
    async handleMint() {
      // this.$router.push({'name': 'Minting'})
      await this.$store.dispatch('setResult')
      await this.$store.dispatch('setDeployedPictureMeta')
      const obj = {
        token_id: `token-${Date.now()}`,
        metadata: {
          title: 'NFT token title',
          description: 'NFT token description',
          media: this.getDeployedPictureMeta,
          copies: 1,
        },
      }
      this.createRandomNft(obj)
      console.log('handleMint')
    },
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async chooseEffect(id) {
      this.$store.dispatch('setEffectChoice', id)
      await this.sleep(5)
    },
    createRandomNft(obj) {
      console.log(obj, 'createNft')
      window.contract
        .nft_mint({
          token_id: obj.token_id,
          metadata: obj.metadata,
          receiver_id: window.accountId,
        }, "300000000000000", '9610000000000000000000')
        .then((data) => {
          console.log(data, 'getNftTotal')
        })
    },
    createNft() {
      console.log('createNft')
      window.contract
        .nft_mint({
          token_id: this.nftObj.token_id,
          metadata: this.nftObj.metadata,
          receiver_id: window.accountId,
        }, "300000000000000", '9610000000000000000000')
        .then((data) => {
          console.log(data, 'getNftTotal')
        })
    },
    getNftTotal() {
      //retrieve greeting
      window.contract
        .nft_supply_for_owner({ account_id: window.accountId })
        .then((data) => {
          console.log(data, 'getNftTotal')
        })
    },
    nftTokensForOwner() {
      window.contract
        .nft_tokens_for_owner({ account_id: window.accountId, limit: 15 })
        .then((data) => {
          this.nftArray = data
          this.$store.dispatch('passNFT', data[2].metadata)
          console.log(data, 'nftTokensForOwner')
        })
    },
    nftTokendata() {
      window.contract
        .nft_token({ token_id: 'token-1' })
        .then((data) => {
          console.log(data, 'nftTokendata')
        })
    },
    nftMetadata() {
      window.contract
        .nft_metadata()
        .then((data) => {
          console.log(data, 'nftMetadata')
        })
    },
    retrieveSavedGreeting() {
      //retrieve greeting
      window.contract
        .get_greeting({ account_id: window.accountId })
        .then((greetingFromContract) => {
          console.log(greetingFromContract, 'greetingFromContract')
          this.savedGreeting = greetingFromContract
          this.newGreeting = greetingFromContract
        })
    },

    async saveGreeting() {
      // fired on form submit button used to update the greeting

      // disable the form while the value gets updated on-chain
      this.$refs.fieldset.disabled = true

      try {
        
        // make an update call to the smart contract
        console.log(window.contract, 'CONTRACT')
        await window.contract.set_greeting({
          account_id: window.accountId,
          // pass the new greeting
          message: this.newGreeting,
        })
      } catch (e) {
        alert(
          "Something went wrong! " +
            "Maybe you need to sign out and back in? " +
            "Check your browser console for more info."
        )
        throw e //re-throw
      } finally {
        // re-enable the form, whether the call succeeded or failed
        this.$refs.fieldset.disabled = false
      }

      // update savedGreeting with persisted value
      this.savedGreeting = this.newGreeting

      this.notificationVisible = true //show new notification

      // remove Notification again after css animation completes
      // this allows it to be shown again next time the form is submitted
      setTimeout(() => {
        this.notificationVisible = false
      }, 11000)

    },

    logout: logout,
  },
}
</script>

<style>
.nft-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.nft-cards__item {
  margin-bottom: 30px;
}

.nft-cards__media {
  display: block;
  width: 200px;
  height: 200px;
}

.form-nft {
  padding: 15px;
  border: 1px solid black;
  margin-bottom: 20px;
}

.form-nft__input {
  width: 100%;
  margin-bottom: 15px;
}

.form-nft__input:last-child {
  margin-bottom: 0;
}

</style>