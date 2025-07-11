use ic_cdk::{api, query, update, init, pre_upgrade, post_upgrade};
use ic_cdk::storage;
use candid::{CandidType, Deserialize, Principal};
use std::collections::{HashMap, HashSet};
use std::cell::RefCell;

// -----------------------------
// Post structures
// -----------------------------

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct PostContent {
    pub text: String,
    pub image: Option<Vec<u8>>,
    pub donation: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Post {
    pub id: String,
    pub handle: String,
    pub timestamp: u64,
    pub content: PostContent,
    pub nullifier_hash: String,
}

// -----------------------------
// Global state
// -----------------------------

type State = (
    HashMap<String, Post>,         // POSTS
    HashSet<String>,               // USED_NULLIFIERS
    HashSet<Principal>,            // NFT_OWNERS
    HashMap<Principal, u64>,       // BALANCES
    HashMap<String, u64>           // NULLIFIER_BALANCES
);

thread_local! {
    static POSTS: RefCell<HashMap<String, Post>> = RefCell::new(HashMap::new());
    static USED_NULLIFIERS: RefCell<HashSet<String>> = RefCell::new(HashSet::new());
    static NFT_OWNERS: RefCell<HashSet<Principal>> = RefCell::new(HashSet::new());
    static BALANCES: RefCell<HashMap<Principal, u64>> = RefCell::new(HashMap::new());
    static NULLIFIER_BALANCES: RefCell<HashMap<String, u64>> = RefCell::new(HashMap::new());
}

// -----------------------------
// Canister lifecycle
// -----------------------------

#[init]
fn init() {
    ic_cdk::println!("Canister initialized 🚀");
    seed_posts(); // create example posts on first deploy
}

#[pre_upgrade]
fn pre_upgrade() {
    let state = (
        POSTS.with(|p| p.borrow().clone()),
        USED_NULLIFIERS.with(|u| u.borrow().clone()),
        NFT_OWNERS.with(|n| n.borrow().clone()),
        BALANCES.with(|b| b.borrow().clone()),
        NULLIFIER_BALANCES.with(|n| n.borrow().clone()),
    );
    storage::stable_save((state,)).expect("Failed to save state");
}

#[post_upgrade]
fn post_upgrade() {
    restore_state().expect("Failed to restore state from stable memory");
    ic_cdk::println!("Canister upgraded and state restored 🔄");
    seed_posts(); // add example posts again after upgrade (for demo)
}

fn restore_state() -> Result<(), String> {
    let ((posts, used_nullifiers, nft_owners, balances, nullifier_balances),): (State,) =
        storage::stable_restore().map_err(|e| format!("Cannot restore state: {:?}", e))?;
    POSTS.with(|p| *p.borrow_mut() = posts);
    USED_NULLIFIERS.with(|u| *u.borrow_mut() = used_nullifiers);
    NFT_OWNERS.with(|n| *n.borrow_mut() = nft_owners);
    BALANCES.with(|b| *b.borrow_mut() = balances);
    NULLIFIER_BALANCES.with(|n| *n.borrow_mut() = nullifier_balances);
    Ok(())
}

// -----------------------------
// Posts
// -----------------------------

#[update]
fn create_post(handle: String, text: String, image: Option<Vec<u8>>, nullifier_hash: String, proof: String) -> Result<String, String> {
    if !verify_proof(&proof, &nullifier_hash) {
        return Err("Invalid zk proof.".into());
    }

    let timestamp = api::time();
    let id = timestamp.to_string();

    let post = Post {
        id: id.clone(),
        handle,
        timestamp,
        content: PostContent {
            text,
            image,
            donation: 0,
        },
        nullifier_hash,
    };

    POSTS.with(|posts| posts.borrow_mut().insert(id.clone(), post));
    Ok(id)
}

#[query]
fn get_posts() -> Vec<Post> {
    POSTS.with(|posts| posts.borrow().values().cloned().collect())
}

#[update]
fn donate(post_id: String, amount: u64) -> Result<String, String> {
    POSTS.with(|posts| {
        let mut posts = posts.borrow_mut();
        if let Some(post) = posts.get_mut(&post_id) {
            post.content.donation += amount;
            Ok(format!("Donated {} to post {}", amount, post_id))
        } else {
            Err("Post not found.".into())
        }
    })
}

#[update]
fn withdraw(post_id: String, nullifier_hash: String, proof: String) -> Result<String, String> {
    if !verify_proof(&proof, &nullifier_hash) {
        return Err("Invalid zk proof.".into());
    }

    POSTS.with(|posts| {
        let mut posts = posts.borrow_mut();
        if let Some(post) = posts.get_mut(&post_id) {
            if post.nullifier_hash != nullifier_hash {
                return Err("Unauthorized: zk proof does not match post owner.".into());
            }

            let amount = post.content.donation;
            if amount == 0 {
                return Err("No donations available to withdraw.".into());
            }

            post.content.donation = 0;

            NULLIFIER_BALANCES.with(|b| {
                let mut balances = b.borrow_mut();
                let bal = balances.entry(nullifier_hash.clone()).or_insert(0);
                *bal += amount;
            });

            Ok(format!("Withdrawn {} from post", amount))
        } else {
            Err("Post not found.".into())
        }
    })
}

// -----------------------------
// NFT + Balance
// -----------------------------

#[update]
fn mint_nft(principal: Principal) -> Result<String, String> {
    let already_owned = NFT_OWNERS.with(|owners| {
        let mut owners = owners.borrow_mut();
        if owners.contains(&principal) {
            true
        } else {
            owners.insert(principal);
            false
        }
    });

    if already_owned {
        return Err("Already owns NFT".into());
    }

    BALANCES.with(|b| b.borrow_mut().insert(principal, 1000));
    Ok(format!("NFT minted for principal {}", principal))
}

#[query]
fn check_user_has_nft(principal: Principal) -> bool {
    NFT_OWNERS.with(|owners| owners.borrow().contains(&principal))
}

#[query]
fn get_balance(principal: Principal) -> u64 {
    BALANCES.with(|b| *b.borrow().get(&principal).unwrap_or(&0))
}

#[query]
fn get_balance_by_nullifier(nullifier_hash: String) -> u64 {
    NULLIFIER_BALANCES.with(|b| *b.borrow().get(&nullifier_hash).unwrap_or(&0))
}

// -----------------------------
// ZK placeholder
// -----------------------------

fn verify_proof(proof: &str, nullifier_hash: &str) -> bool {
    ic_cdk::println!("(placeholder) verifying zk proof for nullifier {}", nullifier_hash);
    proof.len() > 5 && nullifier_hash.len() > 5
}

// -----------------------------
// Seeder: fills posts
// -----------------------------

fn seed_posts() {
    POSTS.with(|posts| {
        let mut posts = posts.borrow_mut();
        if posts.is_empty() {
            posts.insert(
                "1".to_string(),
                Post {
                    id: "1".to_string(),
                    handle: "alice".into(),
                    timestamp: api::time(),
                    content: PostContent {
                        text: "Hello, decentralized world!".into(),
                        image: None,
                        donation: 42,
                    },
                    nullifier_hash: "fake_nullifier_1".into(),
                },
            );
            posts.insert(
                "2".to_string(),
                Post {
                    id: "2".to_string(),
                    handle: "bob".into(),
                    timestamp: api::time(),
                    content: PostContent {
                        text: "Support my activism!".into(),
                        image: None,
                        donation: 77,
                    },
                    nullifier_hash: "fake_nullifier_2".into(),
                },
            );
        }
    });
}
