<template>
  <div class="page">
    <nav-bar :navigation="getNavigation"/>
    <div v-if="getNftsAreLoading || [0, 2, 3, 4].includes(getStatus)" class="loading-container">
      <spinner :size="92" color="#000" />
      <h1>{{ statusText }}</h1>
    </div>
    <main v-else>
      <h1>Create new NFT</h1>
      <form class="form-nft">
        <uploader @selected="setUploadedImg"/>
        <div class="form-ntf__inputs">
          <input
            type="text"
            placeholder="NFT title"
            class="input form-nft__input"
            v-model="nftObj.metadata.title"
          >
          <textarea
            type="text"
            placeholder="NFT description"
            class="input form-nft__input form-nft__textarea"
            v-model="nftObj.metadata.description"
          />
          <button
            class="main-btn"
            type="submit"
            @click="createNewNFT"
          >Submit</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
// import EffectCards from "../components/EffectCards/EffectCards.vue"
import Spinner from "../components/Spinner"
import { mapGetters, mapActions } from "vuex"
import { StatusType } from "../utilities"
import NavBar from '../components/NavBar/NavBar'
import Uploader from '../components/Uploader/Uploader'

export default {
  name: "CreateNFT",

  components: {
    Spinner,
    NavBar,
    Uploader,
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
      getNavigation: [
        {
          text: 'Back to Gallery',
          name: 'ChooseNFT',
        },
      ],
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
      case StatusType.Approving:
        return "Redirecting to Approve NFT"
      case StatusType.Applying:
        return "Applying the chosen effect..."
      case StatusType.DeployingToIPFS:
        return "Uploading the result to IPFS..."
      case StatusType.Minting:
        return "NFT Minting..."
      case StatusType.Minted:
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

  mounted() {
    this.setEffects()
  },

  methods: {
    ...mapActions([
      'setResult',
      'passNFT',
      'setDeployedPictureMeta',
      'setEffectChoice',
      'createNewRandomNFT',
      'createNewUsualNFT',
      'setEffects',
    ]),
    setUploadedImg(src) {
      this.nftObj.metadata.media = src 
    },
    // choosing NFT for applying effects
    chooseNFT(item) {
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
      this.createNewRandomNFT({
        token_id: obj.token_id,
        metadata: obj.metadata,
      })
    },
    createNewNFT() {
      this.createNewUsualNFT({
        token_id: `token-${Date.now()}`,
        metadata: this.nftObj.metadata,
      })
    },
  },
}
</script>

<style>

</style>