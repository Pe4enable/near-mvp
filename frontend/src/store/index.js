import Vue from 'vue'
import Vuex from 'vuex'

import {
  nftTokensForOwner,
  deployNFTtoIPFS,
  approveNFT,
  createRandomNft,
  createUsualNFT,
  sendNFT,
} from "../near_utilities"


import {getEffects, modifyPicture} from "../api"
// import {BigNumber} from "ethers";
import * as IPFS from "ipfs-core"
// import {getImageURLFromObject} from "../utilities";

Vue.use(Vuex)

export const Status = Object.freeze({
  Error: -3,
  Cancelled: -2,
  ChoosingParameters: -1,
  Applying: 0,
  Approving: 1,
  DeployingToIPFS: 2,
  DeployedToIPFS: 3,
  Minting: 4,
  Minted: 5,
  Approved: 6,
})

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
    status: Status.ChoosingParameters
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
    }
  },
  actions: {
    passNFT ({commit}, data) {
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
    async setResult ({commit, dispatch, getters}) {
      dispatch('setStatus', Status.Applying)
      commit('setResult', await modifyPicture(getters.getNFTforModification.media, getters.getEffectChoice))
    },
    async setDeployedPictureMeta ({commit, dispatch, getters}) {
      dispatch('setStatus', Status.DeployingToIPFS)
      commit('setDeployedPictureMeta', await deployNFTtoIPFS(getters.getIpfs, getters.getResult, getters.getNFTforModification))
    },
    async getListOfNFT ({commit, dispatch, getters}) {
      dispatch('setNFTsLoading', true)
      const result = await nftTokensForOwner({dispatch}, getters.getAccountId, getters.getContract)
      console.log(result, 'result getListOfNFT')
      commit('passAllNFTs', result)
    },
    createNewRandomNFT ({getters, dispatch},  { token_id, metadata }) {
      dispatch('setStatus', Status.Minting)
      createRandomNft(token_id, metadata, getters.getAccountId, getters.getContract)
    },
    createNewUsualNFT ({getters, dispatch},  { token_id, metadata }) {
      console.log(token_id, metadata, 'result createNewUsualNFT')
      dispatch('setStatus', Status.Minting)
      createUsualNFT(token_id, metadata, getters.getAccountId, getters.getContract)
    },
    setNFTApproveId ({getters, dispatch}, token_id) {
      dispatch('setStatus', Status.Approving)
      approveNFT(getters.getAccountId, token_id, getters.getContract)
    },
    sendNFTByToken ({getters, dispatch}, { receiver, token_id }) {
      dispatch('setStatus', Status.Approving)
      sendNFT(receiver, token_id, getters.getContract)
    },
  },
  getters: {
    getEffects: state => state.effects,
    getEffect: state => state.effects.filter(x => x.id === state.effectChoice) ? [0] : null,
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
    getNFTforModification: (state) => state.NFT
  }
})

export default store