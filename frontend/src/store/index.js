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


import {StatusType, getIPFS} from "../utilities"
import {getEffects, modifyPicture} from "../api"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    ipfs: null,
    accountBalance: null,
    allNFTs: [],
    nftChoice: [],
    nftLoading: false,
    contractLoading: false,
    contract: null,
    account_id: null,
    effects: [],
    effectChoice: null,
    deployedPictureMeta: null,
    nftTransactionHash: null,
    globalLoading: false,
    imageResult: null,
    NFTdata: null,
    arrayNFTs: null,
    NFTsPool: [],
    status: StatusType.ChoosingParameters,
    wallet: null,
    balance: null,
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
    setImageResult (state, blob) {
      state.imageResult = blob
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
      state.NFTdata = payload
    },
    setNFTArray (state, payload) {
      state.arrayNFTs = payload
    },
    SET_CURRENT_CONTRACT_LOADING (state, payload) {
      state.contractLoading = payload
    },
    SET_CURRENT_CONTRACT (state, payload) {
      state.contract = payload
    },
    SET_TOKEN_IMAGE (state, tokenInfo) {
      state.NFTsPool.push(tokenInfo)
    },
    SET_CURRENT_WALLET (state, payload) {
      state.wallet = payload
    },
    SET_ACCOUNT_ID (state, payload) {
      state.account_id = payload
    },
    SET_CURRENT_BALANCE (state, payload) {
      state.balance = payload
    },
  },
  actions: {
    passNFT ({commit}, data) {
      console.log(data, 'passNFT')
      commit('setNFT', data)
    },
    passChosenTokens ({commit}, data) {
      console.log(data, 'passNFT')

      sessionStorage.setItem("tokens_id", data)
      commit('setNFTArray', data)
    },
    // async setBalance ({commit, state}) {
    //   commit('setAccountBalance', await getAccountBalance(state.ethersProvider, state.accountAddress))
    // },
    setContractLoading ({commit}, data) {
      console.log(data , 'setContractLoading')
      commit('SET_CURRENT_CONTRACT_LOADING', data)
    },
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
    async setIpfs ({commit}) {
      const ipfs = await getIPFS()
      commit('setIpfs', await ipfs.create())
    },
    async setEffects ({commit}) {
      commit('setEffects', await getEffects())
    },
    async setResult ({commit, dispatch, getters}, type) {
      dispatch('setStatus', StatusType.Applying)
      console.log(getters, 'set RESULT')
      if (type === "base64") {
        commit('setImageResult', getters.getNFTforModification.media)
      } else {
        commit('setImageResult', await modifyPicture(getters.getNFTforModification.media, getters.getEffectChoice))
      }
    },
    async setDeployedPictureMeta ({commit, dispatch, getters}, type) {
      dispatch('setStatus', StatusType.DeployingToIPFS)
      console.log('set setDeployedPictureMeta')
      commit('setDeployedPictureMeta', await deployNFTtoIPFS(getters.getIpfs, getters.getResult, getters.getNFTforModification, type))
    },
    async getListOfNFT ({commit, dispatch, getters}) {
      dispatch('setNFTsLoading', true)
      console.log(getters, 'getters getListOfNFT')
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
    // NEAR config settings
    setCurrentContract ({commit}, contract) {
      commit('SET_CURRENT_CONTRACT', contract)
    },
    setNearWalletConnection ({commit}, wallet) {
      commit('SET_CURRENT_WALLET', wallet)
    },
    setAccountId ({commit}, id) {
      commit('SET_ACCOUNT_ID', id)
    },
    setNearBalance ({commit}, balance) {
      commit('SET_CURRENT_BALANCE', balance)
    },
  },
  getters: {
    getEffects: state => state.effects,
    getEffect: state => state.effects.find(x => x.id === state.effectChoice),
    getEffectChoice: state => state.effectChoice,
    getIpfs: state => state.ipfs,
    getResult: state => state.imageResult,
    getDeployedPictureMeta: state => state.deployedPictureMeta,
    getStatus: state => state.status,
    getTransactionHash: state => state.nftTransactionHash,
    getNftsAreLoading: state => state.nftLoading,
    getContractLoading: state => state.contractLoading,
    getAccountId: state => state.account_id,
    getContract: state => state.contract,
    getAllNFTs: state => state.allNFTs,
    getNFTsPool: state => state.NFTsPool,
    getNFTforModification: (state) => state.NFTdata,
    getNFTArray: (state) => state.arrayNFTs,
    getCurrentWallet: (state) => state.wallet,
    getCurrentWalletBalance: (state) => state.balance,
  },
})

export default store