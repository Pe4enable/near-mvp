import Vue from 'vue'
import Vuex from 'vuex'

import {
  nftTokensForOwner,
  deployNFTtoIPFS,
  approveNFT,
  createRandomNft,
  createUsualNFT,
  sendNFT,
  getImageForTokenByURI,
} from "../near_utilities"


import {StatusType} from "../utilities"
import {getEffects, modifyPicture} from "../api"

// too heavy, this one adding 2mb to builded bundle-js (total 2.5mb)
import * as IPFS from "ipfs-core"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    ipfs: null,
    accountBalance: null,
    allNFTs: [],
    nftChoice: [],
    nftLoading: false,
    contract: null,
    account_id: null,
    effects: [],
    effectChoice: null,
    deployedPictureMeta: null,
    nftTransactionHash: null,
    globalLoading: false,
    result: null,
    NFT: null,
    NFTsPool: [],
    status: StatusType.ChoosingParameters
  },
  mutations: {
    setIpfs (state, ipfsInstance) {
      state.ipfs = ipfsInstance
    },
    setAccountAddress (state, accountAddress) {
      state.accountAddress = accountAddress
    },
    setEffects (state, effects) {
      state.effects = effects
    },
    setEffectChoice(state, choice) {
      state.effectChoice = choice
    },
    setResult (state, blob) {
      state.result = blob
    },
    setNFTsLoading (state, blob) {
      state.nftLoading = blob
    },
    setDeployedPictureMeta (state, meta) {
      state.deployedPictureMeta = meta
    },
    setNFThash (state, transactionHash) {
      state.nftTransactionHash = transactionHash
    },
    setStatus (state, status) {
      state.status = status
    },
    passAllNFTs (state, payload) {
      state.allNFTs = payload
    },
    setNFT (state, payload) {
      state.NFT = payload
    },
    SET_CURRENT_CONTRACT (state, payload) {
      state.contract = payload
    },
    SET_ACCOUNT_ID (state, payload) {
      state.account_id = payload
    },
    SET_TOKEN_IMAGE (state, tokenInfo) {
      state.NFTsPool.push(tokenInfo)
    },
  },
  actions: {
    passNFT ({commit}, data) {
      console.log(data, 'passNFT')
      commit('setNFT', data)
    },
    // async setBalance ({commit, state}) {
    //   commit('setAccountBalance', await getAccountBalance(state.ethersProvider, state.accountAddress))
    // },
    setEffectChoice ({commit}, choice) {
      commit('setEffectChoice', choice)
    },
    setNFTsLoading ({commit}, isLoading) {
      commit('setNFTsLoading', isLoading)
    },
    setWrappedNFTsLoading ({commit}, isLoading) {
      commit('setWrappedNFTsLoading', isLoading)
    },
    setStatus ({commit}, status) {
      commit("setStatus", status)
    },
    setCurrentContract ({commit}, contract) {
      commit('SET_CURRENT_CONTRACT', contract)
    },
    setAccountId ({commit}, id) {
      commit('SET_ACCOUNT_ID', id)
    },
    async setIpfs ({commit}) {
      commit('setIpfs', await IPFS.create())
    },
    async setEffects ({commit}) {
      commit('setEffects', await getEffects())
    },
    async setResult ({commit, dispatch, getters}, type) {
      dispatch('setStatus', StatusType.Applying)
      console.log('set RESULT')
      if (type === "base64") {
        commit('setResult', getters.getNFTforModification.media)
      } else {
        commit('setResult', await modifyPicture(getters.getNFTforModification.media, getters.getEffectChoice))
      }
    },
    async setDeployedPictureMeta ({commit, dispatch, getters}, type) {
      dispatch('setStatus', StatusType.DeployingToIPFS)
      console.log('set setDeployedPictureMeta')
      commit('setDeployedPictureMeta', await deployNFTtoIPFS(getters.getIpfs, getters.getResult, getters.getNFTforModification, type))
    },
    async getListOfNFT ({commit, dispatch, getters}) {
      dispatch('setNFTsLoading', true)
      const result = await nftTokensForOwner({dispatch}, getters.getAccountId, getters.getContract)
      commit('passAllNFTs', result)
    },
    async setTokenImage ({commit,getters}, token) {
      let url = null
      if (getters.getIpfs) {
        url = await getImageForTokenByURI(getters.getIpfs, token.metadata.media)
      }
      commit('SET_TOKEN_IMAGE', { tokenImage: url, token_id: token.token_id})
    },
    createNewRandomNFT ({getters, dispatch},  { token_id, metadata }) {
      dispatch('setStatus', StatusType.Minting)
      createRandomNft(token_id, metadata, getters.getAccountId, getters.getContract)
    },
    createNewUsualNFT ({getters, dispatch},  { token_id, metadata }) {
      console.log(token_id, metadata, 'result createNewUsualNFT')
      dispatch('setStatus', StatusType.Minting)
      createUsualNFT(token_id, metadata, getters.getAccountId, getters.getContract)
    },
    setNFTApproveId ({getters, dispatch}, token_id) {
      dispatch('setStatus', StatusType.Approving)
      approveNFT(getters.getAccountId, token_id, getters.getContract)
    },
    sendNFTByToken ({getters, dispatch}, { receiver, token_id }) {
      dispatch('setStatus', StatusType.Approving)
      sendNFT(receiver, token_id, getters.getContract)
    },
  },
  getters: {
    getEffects: state => state.effects,
    getEffect: state => state.effects.find(x => x.id === state.effectChoice),
    getEffectChoice: state => state.effectChoice,
    getIpfs: state => state.ipfs,
    getResult: state => state.result,
    getDeployedPictureMeta: state => state.deployedPictureMeta,
    getStatus: state => state.status,
    getTransactionHash: state => state.nftTransactionHash,
    getNftsAreLoading: state => state.nftLoading,
    getAccountId: state => state.account_id,
    getContract: state => state.contract,
    getAllNFTs: state => state.allNFTs,
    getNFTsPool: state => state.NFTsPool,
    getNFTforModification: (state) => state.NFT
  }
})

export default store