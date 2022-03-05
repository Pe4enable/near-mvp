<template>
  <div class="page">
    <div v-if="getNftsAreLoading" class="loading-container">
      <spinner :size="92" color="#000" />
    </div>
    <main v-else>
      <h1>Create new NFT</h1>
      <form class="form-nft" @submit.prevent="createNewNFT">
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
      <h1 class="h1--no-logo">Choose NFT and apply effect</h1>
      <div class="nft-cards">
        <div
          v-for="(item, key) in getAllNFTs"
          :key="key"
          class="nft-cards__item"
          :class="{ 'chosen-card': cardClass(item.token_id)}"
          @click="chooseNFT(item)"
        >
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
  </div>
</template>

<script>
import EffectCards from "../components/EffectCards/EffectCards.vue"
import Spinner from "../components/Spinner"
import { mapGetters } from "vuex"


export default {
  name: "ChooseNFT",

  async mounted() {
    await this.$store.dispatch("setEffects")
  },

  components: {
    EffectCards,
    Spinner
  },

  data() {
    return {
      nftObj: {
        metadata: {
          title: 'NFT token 2 title',
          description: 'NFT token 2 description',
          media: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/VitalikButerinProfile.jpg/1200px-VitalikButerinProfile.jpg',
        },
        receiver_id: '',
        token_id: [],
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
      'getAllNFTs',
      'getNftsAreLoading'
    ]),
    accountId() {
      return window.accountId
    },
    cardClass() {
      return (idx) => this.nftObj.token_id.indexOf(idx) !== -1
    },
  },

  methods: {
    chooseNFT(item) {
      console.log(item, 'item')
      const index = this.nftObj.token_id.findIndex((_) => _ === item.token_id)

      // need smart contracts for bundling NFT
      if (this.nftObj.token_id && this.nftObj.token_id.length > 0) {
        if (item.tokenId === this.nftObj.token_id[0]) {
          this.nftObj.token_id.splice(index, 1)
        }
      } else {
        this.nftObj.token_id.push(item.token_id)
      }
      
      this.$store.dispatch('passNFT', item.metadata)

      // Currently approving multiple NFTs is problem, for this need smart contract, bundle approve + bundle sending

      // if (index > -1) {
      //   this.nftObj.token_id.splice(index, 1)
      // } else {
      //   this.nftObj.token_id.push(tokenId)
      // }
    },
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
      this.createNFTWithEffect(obj)
      console.log('handleMint')
    },
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async chooseEffect(id) {
      if (this.getEffectChoice && id === this.getEffectChoice) {
        this.$store.dispatch('setEffectChoice', null)
      } else {
        this.$store.dispatch('setEffectChoice', id)
      }
      await this.sleep(5)
    },
    createNFTWithEffect(obj) {
      console.log(obj, 'createNft')
      this.$store.dispatch('createNewRandomNFT', {
        token_id: obj.token_id,
        metadata: obj.metadata,
      })
    },
    createNewNFT() {
      console.log('createNft')
      this.$store.dispatch('createNewUsualNFT', {
        token_id: `token-${Date.now()}`,
        metadata: this.nftObj.metadata,
      })
    },
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
  width: 17%;
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