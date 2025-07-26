<h1 align="center">🕊️ zkActivist</h1>
<p align="center">
  <b>Anonymous, censorship-resistant social media for activists — powered by Zero-Knowledge & Internet Computer.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Privacy-ZK%20Proofs-blueviolet?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Chain-Internet%20Computer-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Framework-React%20+%20Rust-blue?style=for-the-badge"/>
</p>

---

## ✨ Vision
> _"Reclaim free expression. Speak truth anonymously. Own your voice onchain."_

---

## 🚀 Features

- **Anonymous Zero-Knowledge Login** — Sign in with a secret phrase, generate zk-SNARKs, and never reveal your wallet.  
- **Reputation NFTs** — Gate platform access via soulbound-like NFTs for verified activists.  
- **Onchain Posts** — Store text & images on Internet Computer canisters, forever censorship-resistant.  
- **Built-in Donations** — Support activists directly with ICP donations.  
- **zk Withdrawals** — Claim funds anonymously, preserving privacy.

---

## 🧩 Tech Stack

| Layer           | Tech Used                         |
|-----------------|-----------------------------------|
| **Frontend**    | React + TailwindCSS               |
| **Backend**     | Rust Canisters (ic-cdk)           |
| **ZK Proofs**   | Circom + snarkjs (Groth16, Poseidon) |
| **Storage**     | Onchain stable Rust structs       |
| **Infra**       | dfx for canister deployment       |

---

## 📸 Screenshots (Preview)

*(Add screenshots of Landing, Signin, Feed, and Donations)*

---

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/zkActivist.git
cd zkActivist

# Install dependencies
npm install

# Start local ICP replica
dfx start --background

# Deploy backend canister
dfx deploy

# Run frontend
npm run dev
