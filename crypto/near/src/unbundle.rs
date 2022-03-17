use near_sdk::collections::Vector;
use serde_derive::{Serialize, Deserialize};
use crate::*;

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_unbundle(
        &mut self,
        token_id: TokenId,
    ) {
        assert_one_yocto();
        //get the sender to transfer the token from the sender to the receiver
        let caller_id = env::predecessor_account_id();
        //get the token object if there is some token object
        let mut token = if let Some(token) = self.tokens_by_id.get(&token_id) {
            if token.owner_id != caller_id {
                //we refund the owner for releasing the storage used up by the approved account IDs
                refund_approved_account_ids(owner_id, &approved_account_ids);
                // The token is not owner by the receiver anymore. Can't return it.
                return true;
            }
            
            token
        //if there isn't a token object, it was burned and so we return true
        } else {
            //we refund the owner for releasing the storage used up by the approved account IDs
            refund_approved_account_ids(owner_id, &approved_account_ids);
            return true;
        };

    }
}