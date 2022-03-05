const CID = require('cids')
import Vue from 'vue'

// for creating new NFTs with EFFECTS
export function createRandomNft(token_id, metadata, receiver_id, contract) {
  try {
    contract
      .nft_mint({
        token_id,
        metadata,
        receiver_id,
      }, "300000000000000", '9610000000000000000000')
  } catch(err) {
    console.error(err, '')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: `Error - ${err}`,
    })
  }
}

// for creating new NFTs BY inputs FORM
export function createUsualNFT(token_id, metadata, receiver_id, contract) {
  try {
    contract
      .nft_mint({
        token_id,
        metadata,
        receiver_id,
      }, "300000000000000", '9610000000000000000000')
      .then((data) => {
        console.log(data, 'getNftTotal')
      })
  } catch(err) {
    console.error(err, '')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: `Error - ${err}`,
    })
  }
}

export async function nftTokensForOwner({dispatch}, account_id, contract) {
  let NFTs = []
  try {
    await contract
      .nft_tokens_for_owner({ account_id, limit: 30 })
      .then((data) => NFTs = data)

    dispatch('setNFTsLoading', false)
  } catch(err) {
    console.error(err, '')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: `Cant load Owner NFTs. Error - ${err}`,
    })
  }

  return NFTs
}

export function approveNFT(account_id, token_id, contract) {
  try {
    contract
      .nft_approve({
        account_id,
        token_id,
      }, "300000000000000", '520000000000000000000')
      .then((data) => {
        console.log(data, 'approveNFT')
      })
  } catch(err) {
    console.error(err, '')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: `Error - ${err}`,
    })
  }
}

export function sendNFT(receiver_id, token_id, contract) {
  try {
    contract
      .nft_transfer({
        receiver_id,
        token_id,
        approval_id: 0,
        memo: 'testing'
      }, "300000000000000", '1')
      .then((data) => {
        console.log(data, 'nftTokensForOwner')
      })
  } catch(err) {
    console.error(err, '')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: `Error - ${err}`,
    })
  }
}

// currently unavailable

// export function burnNFT() {
//   console.log('approve')
//   window.contract
//     .nft_burn({
//       account_id: 'near_testing.testnet',
//       token_id: this.nftObj.token_id[0],
//     }, "300000000000000", '1210000000000000000000')
//     .then((data) => {
//       console.log(data, 'approveNFT')
//     })
// }

// just for tests
export function nftTokendata(contract, token_id) {
  try {
    contract
      .nft_token({ token_id })
      .then((data) => {
        console.log(data, 'nftTokendata')
      })
  } catch(err) {
    console.error(err, '')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: `Error - ${err}`,
    })
  }
}

// just for tests
export function nftMetadata(contract) {
  try {
    contract
      .nft_metadata()
      .then((data) => {
        console.log(data, 'nftMetadata')
      })
  } catch(err) {
    console.error(err, '')
    Vue.notify({
      group: 'foo',
      title: 'Important message',
      text: `Error - ${err}`,
    })
  }
}

// todo: make v1 to v2, or rethink v1 for more effective implementation
async function pushImageToIpfs(ipfsInstance, objectURL) {
  let blob = await fetch(objectURL).then(r => r.blob())
  let cid = await ipfsInstance.add((blob), {
    cidVersion: 1,
    hashAlg: 'sha2-256'
  })
  console.log(cid, 'cid')
  const cidV1 = new CID(cid.path).toV1().toString('base32')
  console.log(cidV1, 'cidV1')
  return cidV1
}

async function pushObjectToIpfs(ipfsInstance, object) {
  let cid = await ipfsInstance.add(JSON.stringify(object))
  console.log(cid, 'cid')
  return cid
}

export async function deployNFTtoIPFS(ipfsInstance, imageURL, oldMeta) {
  console.log(ipfsInstance, imageURL, oldMeta, 'deployNFTtoIPFS')
  let imageCID = await pushImageToIpfs(ipfsInstance, imageURL)
  let meta = JSON.parse(JSON.stringify(oldMeta))
  meta.animation_url = `ipfs://${imageCID}`
  let newMetaCID = await pushObjectToIpfs(ipfsInstance, meta)
  console.log(newMetaCID, 'newMetaCID')
  console.log(imageCID, 'imageCID')
  return `https://${imageCID}.ipfs.dweb.link`
}
