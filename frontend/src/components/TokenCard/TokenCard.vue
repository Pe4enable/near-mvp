<template>
  <div class="nft-cards__media-wrap">
    <img
      class="nft-cards__media"
      :src="localImage ? localImage.tokenImage : urlData || placeholder()"
    >
    <router-link
      v-if="editAvailable"
      class="nft-cards__info"
      :to="{ name: 'NFTDetails', params: { id: metadata.token_id }}"
    >
      <icon name="pencil" :size="14" class="upload-icon" />
    </router-link>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { placeholder } from '../../utilities'

export default {
  name: "TokenCard",

  props: [
    'metadata',
    'routeInfo',
    'editAvailable'
  ],
  data() {
    return {
      urlData: null
    }
  },

  methods: {
    ...mapActions([
      'setTokenImage'
    ]),
    async loadContent () {
      if (this.metadata) {
        await this.setTokenImage(this.metadata)
        const url = this.getNFTsPool ? this.getNFTsPool.find((item) => item.token_id === this.metadata.token_id).tokenImage : null
        this.urlData = url
      }
    },
    placeholder
  },

  mounted() {
    // case:
    // if to go to specific page with :id, refresh page, and then back to whole list, watcher do not trigger
    // only mounted request is not enough
    // todo: rethink logic of requests
    if (this.getIpfs && this.getNFTsPool && this.getAllNFTs && this.getNFTsPool.length < this.getAllNFTs.length) {
      this.loadContent()
    }
  },

  watch: {
    getIpfs: {
      handler(value) {
        if (value) {
          this.loadContent()
        }
      },
    },
  },

  computed: {
    ...mapGetters([
      'getIpfs',
      'getNFTsPool',
      'getAllNFTs',
    ]),
    localImage () {
      return this.getNFTsPool ? this.getNFTsPool.find((item) => item.token_id === this.metadata.token_id) : null
    },
  }
}

</script>

<style lang="scss" scope>
.nft-cards__media-wrap {
  position: relative;

  &:hover {
    .nft-cards__info {
      opacity: 1;
    }
  }
}

.nft-cards__info {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 4px;
  background: #5ce9bc;
  padding: 8px;
  opacity: .4;
  transition: background .15s ease-in-out, transform .1s ease-in, opacity .15s ease;
  
  &:hover {
    background: #2d0949;
    color: #fff;
    transform: scale(1.2);
  }
}
</style>