<template>
  <div class="page">
    <!-- if minting, applying and deploying to ipfs show prelaoder -->
    <div v-if="getNftsAreLoading || [0, 2, 3, 4].includes(getStatus)" class="loading-container">
      <spinner :size="92" color="#000" />
      <h1 class="h1--no-logo">{{ statusText }}</h1>
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
        <button
          class="btn-main"
          type="submit"
        >Submit</button>
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

      <div
        class="effect-cards"
        v-if="getEffects && getEffects.length"
      >
        <effect-cards
          @cardClicked="chooseEffect"
          content-type="video"
          :show-id="false"
          :cards="getEffects"
          :choice="[getEffectChoice]"
        ></effect-cards>
        <button class="btn-main" @click="handleMint">Submit</button>
      </div>
      <div v-else class="loading-container">
        <spinner :size="92" color="#000" />
        <h1 class="h1--no-logo">{{ statusText }}</h1>
      </div>
    </main>
  </div>
</template>

<script>
import EffectCards from "../components/EffectCards/EffectCards.vue"
import Spinner from "../components/Spinner"
import { mapGetters, mapActions } from "vuex"
import { Status } from "../store"


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
      Status,
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
      'getNftsAreLoading',
      'getStatus',
    ]),
    accountId() {
      return window.accountId
    },
    cardClass() {
      return (idx) => this.nftObj.token_id.indexOf(idx) !== -1
    },
    statusText() {
      switch (this.getStatus) {
      case this.Status.Approving:
        return "Redirecting to Approve NFT"
      case this.Status.Applying:
        return "Applying the chosen effect..."
      case this.Status.DeployingToIPFS:
        return "Uploading the result to IPFS..."
      case this.Status.Minting:
        return "NFT Minting..."
      case this.Status.Minted:
        return "NFT successfully Minted!"
      default:
        return ""
      }
    },
  },

  watch: {
    getStatus: {
      handler(value) {
        this.$notify({
          group: 'foo',
          type: value < 5 ? 'info' : 'success',
          title: 'Status:',
          text: this.statusText,
          duration: 5000,
        })
      },
    },
  },

  methods: {
    ...mapActions([
      'setResult',
      'passNFT',
      'setDeployedPictureMeta',
      'setEffectChoice',
      'createNewRandomNFT',
      'createNewUsualNFT',
    ]),
    // choosing NFT for applying effects
    chooseNFT(item) {
      console.log(item, 'item')
      const index = this.nftObj.token_id.findIndex((_) => _ === item.token_id)

      // need smart contracts for bundling NFT
      if (this.nftObj.token_id && this.nftObj.token_id.length > 0) {
        if (item.token_id === this.nftObj.token_id[0]) {
          this.nftObj.token_id.splice(index, 1)
        } else {
          this.nftObj.token_id.splice(index, 1)
          this.nftObj.token_id.push(item.token_id)
        }
      } else {
        this.nftObj.token_id.push(item.token_id)
      }
      
      this.passNFT(item.metadata)

      // Currently approving multiple NFTs is problem, for this need smart contract, bundle approve + bundle sending

      // if (index > -1) {
      //   this.nftObj.token_id.splice(index, 1)
      // } else {
      //   this.nftObj.token_id.push(tokenId)
      // }
    },
    // minting NFT with NEW effects
    async handleMint() {
      // this.$router.push({'name': 'Minting'})
      await this.setResult()
      await this.setDeployedPictureMeta()
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
        this.setEffectChoice(null)
      } else {
        this.setEffectChoice(id)
      }
      await this.sleep(5)
    },
    createNFTWithEffect(obj) {
      console.log(obj, 'createNft')
      this.createNewRandomNFT({
        token_id: obj.token_id,
        metadata: obj.metadata,
      })
    },
    createNewNFT() {
      console.log('createNft')
      this.createNewUsualNFT({
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