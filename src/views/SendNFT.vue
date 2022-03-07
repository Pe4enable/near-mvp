<template>
  <div class="page">
    <div v-if="getNftsAreLoading || getStatus === 1" class="loading-container">
      <spinner :size="92" color="#000" />
      <h1 class="h1--no-logo">{{ statusText }}</h1>
    </div>
    <main v-else>
      <transition name="fade">
        <div v-if="nftObj.token_id && nftObj.token_id.length">
          <h1 class="h1--no-logo">Send NFTs</h1>
          <div
            class="form-nft"
          >
            <input
              type="text"
              placeholder="Receiver ID"
              class="input form-nft__input"
              v-model="nftObj.receiver_id"
            >
            <div class="form-nft__bottom">
              <button
                class="btn-main"
                @click="approveNFTHandler"
                :disabled="!isNFTApproved"
              >Approve</button>
              <button
                class="btn-main"
                type="submit"
                :disabled="isNFTApproved"
                @click="sendNFTHandler"
              >Send</button>
            </div>
          </div>
        </div>
      </transition>
      <h1 class="h1--no-logo">Choose NFTs</h1>
      <div class="nft-cards">
        <div
          v-for="(item, key) in getAllNFTs"
          :key="key"
          class="nft-cards__item"
          :class="{ 'chosen-card': cardClass(item.token_id)}"
          @click="chooseNFT(item.token_id)"
        >
          <img :src="item.metadata.media" class="nft-cards__media">
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Spinner from "../components/Spinner"
import { mapGetters, mapActions } from "vuex"
import { Status } from "../store"

export default {
  name: "SendNFT",

  components: {
    Spinner
  },

  data() {
    return {
      Status,
      nftObj: {
        receiver_id: 'near_testing2.testnet',
        token_id: [],
      }
    }
  },

  computed: {
    ...mapGetters([
      'getAllNFTs',
      'getNftsAreLoading',
      'getStatus',
    ]),
    cardClass() {
      return (idx) => this.nftObj.token_id.indexOf(idx) !== -1
    },
    isNFTApproved() {
      return this.nftObj.token_id.some((token) => {
        const tokenData = this.getAllNFTs.find((item) => item.token_id === token)
        const getKeyLength = Object.keys(tokenData.approved_account_ids).length
        return getKeyLength === 0
      })
    },
    statusText() {
      switch (this.getStatus) {
      case this.Status.Approving:
        return "Redirecting to Approve NFT Transaction"
      case this.Status.Applying:
        return "Applying the chosen effect..."
      case this.Status.DeployingToIPFS:
        return "Uploading the result to IPFS..."
      case this.Status.Minting:
        return "Minting..."
      case this.Status.Minted:
        return "Minted!"
      case this.Status.Approved:
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
  },

  methods: {
    ...mapActions(['setNFTApproveId', 'sendNFTByToken']),
    chooseNFT(tokenId) {
      const index = this.nftObj.token_id.findIndex((_) => _ === tokenId)

      // need smart contracts for bundling NFT
      if (this.nftObj.token_id && this.nftObj.token_id.length > 0) {
        if (tokenId === this.nftObj.token_id[0]) {
          this.nftObj.token_id.splice(index, 1)
        }
      } else {
        this.nftObj.token_id.push(tokenId)
      }

      // Currently approving multiple NFTs is problem, for this need smart contract, bundle approve + bundle sending

      // if (index > -1) {
      //   this.nftObj.token_id.splice(index, 1)
      // } else {
      //   this.nftObj.token_id.push(tokenId)
      // }
    },
    approveNFTHandler() {
      this.setNFTApproveId(this.nftObj.token_id[0])
    },
    sendNFTHandler() {
      this.sendNFTByToken({ receiver: this.nftObj.receiver_id , token_id: this.nftObj.token_id[0]})
    }
  },
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

.form-nft__bottom {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-nft__bottom button:first-child {
  margin: 10px 0;
}

.form-nft__bottom button {
  min-width: 150px;
}
</style>