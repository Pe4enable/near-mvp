<template>
  <div class="page">
    <nav-bar :navigation="getNav"/>
    <div v-if="getNftsAreLoading || [0, 2, 3, 4].includes(getStatus)" class="loading-container">
      <spinner :size="92" color="#000" />
      <h1>{{ statusText }}</h1>
    </div>
    <main v-else>
      <h1>Choose NFT and apply effect</h1>
      <div class="nft-cards">
        <div
          v-for="item in getAllNFTs"
          :key="item.token_id"
          class="nft-cards__item"
          :class="{ 'chosen-card': cardClass(item.token_id)}"
          @click="chooseNFT(item)"
        >
          <token-card
            :metadata="item"
            :key="item.token_id"
            :edit-available="true"
          />
        </div>
      </div>
      <button v-if="getAllNFTs && getAllNFTs.length" @click="loadMoreNFT" class="main-btn">Get more NFT</button>
    </main>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner"
import TokenCard from '@/components/TokenCard/TokenCard'
import { mapGetters, mapActions } from "vuex"
import { StatusType } from "@/utilities"
import NavBar from '@/components/NavBar/NavBar'

export default {
  name: "ChooseNFT",

  components: {
    Spinner,
    NavBar,
    TokenCard,
  },

  data() {
    return {
      nftObj: {
        metadata: {
          title: 'NFT token 2 title',
          description: 'NFT token 2 description',
        },
        receiver_id: '',
        token_id: [],
      },
      notificationVisible: false,
      nftArray: [],
      urlData: []
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
      'getIpfs',
      'getNFTlimit',
    ]),
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
    getNav() {
      return [
        {
          text: 'Create New',
          name: 'CreateNFT',
          params: null,
        },
        {
          text: 'Send',
          name: 'SendNFT',
          params: {
            id: this.nftObj && this.nftObj.token_id.length === 1 ? this.nftObj.token_id[0] : null
          },
        },
        {
          text: 'Bundle',
          name: 'BundleNFT',
          params: {
            id: this.nftObj && this.nftObj.token_id.length > 1 ? this.nftObj.token_id : null
          },
        },
        {
          text: 'Add Effect',
          name: 'AddEffect',
          params: {
            id: this.nftObj && this.nftObj.token_id.length === 1 ? this.nftObj.token_id[0] : null
          },
        },
      ]
    }
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
      'setTokenImage',
      'passChosenTokens',
      'passNFTlimit',
      'getListOfNFT',
    ]),
    loadMoreNFT() {
      this.passNFTlimit(this.getNFTlimit + 15)
      this.getListOfNFT()
    },
    // choosing NFT for applying effects, sending or bundling later
    chooseNFT(item) {
      const index = this.nftObj.token_id.findIndex((_) => _ === item.token_id)

      // Currently approving multiple NFTs is problem,
      // for this need smart contract, bundle approve + bundle sending
      if (index > -1) {
        this.nftObj.token_id.splice(index, 1)
      } else {
        this.nftObj.token_id.push(item.token_id)
      }

      // this one for single actions, send or effects page
      this.nftObj && this.nftObj.token_id.length === 1 ? this.passNFT(item) : this.passNFT({})

      // this one for bundle page
      this.passChosenTokens(this.nftObj.token_id)
    },
  },
}
</script>

<style lang="scss">
.nft-cards {
  display: flex;
  flex-wrap: wrap;
}

.nft-cards__item {
  width: 19%;
  margin-bottom: 30px;
  margin-right: 5px;
  cursor: pointer;
  transition: transform .1s ease-in-out, box-shadow .1s ease;

  &:last-child {
    margin-right: 0;
  }
}

.nft-cards__item.chosen-card {
  box-shadow: -2px -2px 12px 11px rgba(127, 251, 255, 0.7);
  transform: scale(0.9);
  .nft-cards__info {
    opacity: 1;
  }
}

.nft-cards__media {
  display: block;
  width: 100%;
  height: 200px;
  object-fit: contain;

  .form-nft__detail-page & {
    width: 300px;
    height: 300px;
  }
}

h1 {
  margin-bottom: 30px;
}

</style>