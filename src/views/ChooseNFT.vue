<template>
  <div>
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
        <div class="nft-cards__item" v-for="(item, key) in getAllNFTs" :key="key">
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
import EffectCards from "../components/EffectCards.vue"
import Notification from "../components/Notification.vue"
import { logout } from "../utils"
import { mapGetters } from "vuex"


export default {
  name: "SignedIn",

  async mounted() {
    await this.$store.dispatch("setEffects")
  },

  components: {
    Notification,
    EffectCards,
  },

  data() {
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
      'getAllNFTs'
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
  cursor: pointer;
  transition: transform .1s ease-in-out, box-shadow .1s ease;
}

.nft-cards__item.chosen-card {
  box-shadow: -1px 2px 1px 7px rgba(127, 251, 255, 0.7);
  transform: scale(0.92);
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