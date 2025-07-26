# 🌐 Activist Social Media – Anonymous On-Chain Platform


> **A decentralized social media platform for activists** – enabling anonymous, censorship-resistant communication using **zk-SNARKs** and the **Internet Computer (ICP)**.

---

## **Vision**
Empowering activists with **privacy-first, reputation-based** interactions without compromising safety or freedom of speech.

---

## **Features**

- 🔒 **Anonymous Authentication** – zk-SNARK-based login without revealing wallets  
- 🛡 **Reputation NFTs** – Verify activism credentials without personal data  
- 🖼 **Post with Images** – Share text and media securely on-chain  
- 💸 **Crypto Donations** – Support posts directly with transparent withdrawals  
- 🌗 **Light/Dark Theme** – Accessible design for all users  

---

## **Tech Stack**

- **Frontend:** React + Tailwind CSS + SnarkJS  
- **Backend:** Rust Canister (Internet Computer)  
- **ZK Circuits:** Circom (Poseidon Hash for secrets)  
- **Storage:** ICP on-chain + browser-local session  
- **Blockchain:** Internet Computer (Layer-1)  

---

## **Screenshots & Demo**

### **Landing Page**
![Landing](https://github.com/dwilly8229/activist-social-media/blob/main/assets/Screenshot%202025-07-27%20003510.png?raw=true)

---

### **Post & Content Pages**
<p align="center">
  <img src="https://github.com/dwilly8229/activist-social-media/blob/main/assets/Screenshot%202025-07-27%20003613.png?raw=true" width="48%" />
  <img src="https://github.com/dwilly8229/activist-social-media/blob/main/assets/Screenshot%202025-07-27%20003630.png?raw=true" width="48%" />
</p>

---

### **Login & Sign In**
<p align="center">
  <img src="https://github.com/dwilly8229/activist-social-media/blob/main/assets/Screenshot%202025-07-27%20003720.png?raw=true" width="45%" />
  <img src="https://github.com/dwilly8229/activist-social-media/blob/main/assets/Screenshot%202025-07-27%20003720.png?raw=true" width="45%" />
</p>

---

## **Setup**

### Prerequisites
- Node.js & npm  
- DFX (Internet Computer SDK)  
- Rust (for canister backend)  

### Installation
```bash
# Clone repository
git clone https://github.com/dwilly8229/activist-social-media.git
cd activist-social-media

# Install frontend dependencies
npm install

# Start local ICP replica
dfx start --background

# Deploy canisters
dfx deploy
