<template>
  <div class="page">
    <nav-bar :navigation="getNav"/>
    <div v-if="getNftsAreLoading || getStatus === 1" class="loading-container">
      <spinner :size="92" color="#000" />
      <h1 class="h1--no-logo">{{ statusText }}</h1>
    </div>
    <main v-else>
      <div>
        <h1 class="h1--no-logo">Details of NFT</h1>
        <div
          class="form-nft-send form-nft__detail-page"
          v-if="NFTComputedData && NFTComputedData.metadata"
        >
          <div class="nft-cards">
            <token-card
              :metadata="NFTComputedData"
              :edit-available="false"
            />
          </div>
          <div class="form-nft-send__inputs">
            <span class="form-nft-send__inputs-title">Title</span>
            <input
              type="text"
              placeholder="NFT title"
              class="input form-nft__input"
              v-model="NFTComputedData.metadata.title"
            >
            <span class="form-nft-send__inputs-title">Description</span>
            <textarea
              type="text"
              placeholder="NFT description"
              class="input form-nft__input form-nft__textarea"
              v-model="NFTComputedData.metadata.description"
            />
            <div class="form-nft__bottom">
              <button
                class="main-btn"
                :disabled="true"
              >Burn NFT</button>
              <router-link
                class="main-btn"
                :to="{ name: 'SendNFT', params: { id: NFTComputedData.token_id }}"
              >Send NFT</router-link>
              <button
                class="main-btn"
                type="submit"
                :disabled="true"
                @click="changeFormat"
              >Change Format</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner"
import { mapGetters, mapActions } from "vuex"
import { StatusType } from "@/utilities"
import NavBar from '@/components/NavBar/NavBar'
import TokenCard from '@/components/TokenCard/TokenCard'

export default {
  name: "NFTDetails",

  components: {
    Spinner,
    NavBar,
    TokenCard,
  },

  data() {
    return {
      nftObj: {
        receiver_id: 'near_testing2.testnet',
        token_id: [],
        media: '',
      },
      NFTData: {},
    }
  },

  computed: {
    ...mapGetters([
      'getAllNFTs',
      'getNftsAreLoading',
      'getStatus',
    ]),
    getNav() {
      return [
        {
          text: 'Back to Gallery',
          name: 'ChooseNFT',
          params: null,
        },
      ]
    },
    NFTComputedData() {
      return this.getAllNFTs.find((item) => item.token_id === this.$route.params.id)
    },
    cardClass() {
      return (idx) => this.nftObj.token_id.indexOf(idx) !== -1
    },
    isNFTApproved() {
      return (NFTComputedData) => {
        let getKeyLength = 0

        if (this.getAllNFTs && NFTComputedData) {
          const tokenData = this.getAllNFTs.find((item) => item.token_id === NFTComputedData.token_id)
          getKeyLength = tokenData ? Object.keys(tokenData.approved_account_ids).length : 0
        }

        return getKeyLength === 0
      }
    },
    statusText() {
      switch (this.getStatus) {
      case StatusType.Approving:
        return "Redirecting to Approve NFT Transaction"
      case StatusType.Applying:
        return "Applying the chosen effect..."
      case StatusType.DeployingToIPFS:
        return "Uploading the result to IPFS..."
      case StatusType.Minting:
        return "Minting..."
      case StatusType.Minted:
        return "Minted!"
      case StatusType.Approved:
        return "NFT transaction Succeded"
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
          text: `${this.statusText}`,
          duration: 5000,
        })
      },
    },
    getAllNFTs: {
      handler(value) {
        const data = value.find((item) => item.token_id === this.$route.params.id)
        if (this.getAllNFTs && data) {
          this.NFTData = data
          this.nftObj.media = data.metadata.media
        }
      },
    },
  },

  methods: {
    ...mapActions([
      'setNFTApproveId',
      'sendNFTByToken',
      'getNFTByToken',
    ]),
    changeFormat() {
      console.log('changeFormat')
    },
  },
}
</script>