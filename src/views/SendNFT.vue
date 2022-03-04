<template>
  <main>
    <transition name="fade">
      <div v-if="nftObj.token_id && nftObj.token_id.length">
        <h1 class="h1--no-logo">Send NFTs</h1>
        <form
          class="form-nft"
          @submit.prevent="sendNFT"
        >
          <input
            type="text"
            placeholder="Receiver ID"
            class="input form-nft__input"
            v-model="nftObj.receiver_id"
          >
          <div class="form-nft__bottom">
            <button class="btn-main" @click="approveNFT">Approve</button>
            <button
              class="btn-main"
              type="submit"
              :disabled="isNFTApproved"
            >Send</button>
          </div>
        </form>
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
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "SendNFT",

  data() {
    return {
      nftArray: [],
      nftObj: {
        receiver_id: null,
        token_id: [],
      }
    }
  },

  computed: {
    ...mapGetters([
      'getAllNFTs',
    ]),
    cardClass() {
      return (idx) => this.nftObj.token_id.indexOf(idx) !== -1
    },
    isNFTApproved() {
      return this.nftObj.token_id.some((token) => {
        const tokenData = this.nftArray.find((item) => item.token_id === token)
        const getKeyLength = Object.keys(tokenData.approved_account_ids).length
        return getKeyLength === 0
      })
    },
  },

  methods: {
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
    approveNFT() {
      console.log('approve')
      window.contract
        .nft_approve({
          account_id: 'near_testing.testnet',
          token_id: this.nftObj.token_id[0],
        }, "300000000000000", '12610000000000000000000')
        .then((data) => {
          console.log(data, 'approveNFT')
        })
    },
    sendNFT() {
      console.log(this.nftObj.receiver_id, 'his.nftObj.receiver_id')
      console.log(this.nftObj.token_id, 'this.nftObj.token_id')
      window.contract
        .nft_transfer({
          receiver_id: 'near_testing2.testnet',
          token_id: this.nftObj.token_id[0],
          approval_id: 0,
          memo: 'testing'
        }, "300000000000000", '1')
        .then((data) => {
          console.log(data, 'nftTokensForOwner')
        })
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