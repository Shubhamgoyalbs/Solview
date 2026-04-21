# Solview 🌐

**A Web-Based Solana HD Wallet — built with Next.js & TypeScript**

Live Demo → [solview07.vercel.app](https://solview07.vercel.app)

---

## About

Solview is a fully client-side, non-custodial Hierarchical Deterministic (HD) wallet for the Solana blockchain. It runs entirely in the browser — no backend, no server, no custody. Private keys are derived locally and never transmitted anywhere.

Generate or import a **24-word BIP-39 seed phrase** and instantly derive multiple Solana wallets from it. View live token balances, send SOL, and swap tokens — all from one clean interface.

---

## Features

- 🔐 **Generate or Import Seed Phrase** — Creates a cryptographically secure 24-word BIP-39 mnemonic (256-bit entropy) or validates and imports an existing one
- 👛 **Multiple HD Wallets** — Derive unlimited wallets from a single seed using the BIP-44 path `m/44'/501'/0'/N'`
- 💰 **Live Balances** — Fetches real-time SOL, USDC, and USDT balances with USD prices via Helius RPC
- 📤 **Send SOL** — Transfer SOL to any valid Solana address directly from the browser
- 🔄 **Token Swap** — Swap between SOL, USDC, and USDT using Jupiter's Ultra API
- 👁️ **Private Key Toggle** — Masked by default, reveal with a single click
- 🗑️ **Wallet Management** — Add, delete individual wallets, or clear all at once
- 💾 **Session Persistence** — Wallets survive page refresh via localStorage

---

## Tech Stack

| Category | Library / Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, Radix UI, shadcn/ui |
| Blockchain SDK | @solana/web3.js v1.98.4 |
| RPC Provider | Helius SDK v2.2.1 |
| Mnemonic | bip39 v3.1.0 |
| HD Key Derivation | ed25519-hd-key v1.3.0 |
| Cryptography | tweetnacl v1.0.3 |
| Encoding | bs58 v6.0.0 |
| HTTP Client | axios |
| Notifications | sonner |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Helius](https://helius.dev) API key (free tier works)

### Installation

```bash
git clone https://github.com/Shubhamgoyalbs/solview.git
cd solview
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key_here
NEXT_PUBLIC_JUPYITER_API_KEY=your_jupiter_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

### Key Derivation Pipeline

```
Mnemonic (24 words)
    ↓  mnemonicToSeedSync()
512-bit Seed Buffer
    ↓  derivePath("m/44'/501'/0'/N'")
32-byte Ed25519 Seed
    ↓  nacl.sign.keyPair.fromSeed()
Ed25519 Keypair
    ↓  bs58.encode()
Base58 Public Key + Private Key
```

### Project Structure

```
solview/
├── app/
│   ├── layout.tsx          # Root layout & metadata
│   └── page.tsx            # Entry point
├── components/
│   ├── Body.tsx            # Main state orchestrator
│   ├── InitialState.tsx    # Generate / Import seed UI
│   ├── SecretPhrase.tsx    # Collapsible 24-word display
│   ├── WalletList.tsx      # Wallet list + Add/Clear actions
│   ├── Wallet.tsx          # Individual wallet card
│   ├── SwapSheet.tsx       # Balances, Send SOL, Swap
│   └── Navbar.tsx          # Top navigation bar
├── hooks/
│   └── useWallets.ts       # Core hook — derive & manage wallets
└── utils/
    ├── sol.ts              # Helius client, RPC, token helpers
    └── types.ts            # TypeScript types
```

---

## Security

- ✅ All key operations happen **client-side only**
- ✅ Private keys are **never sent to any server**
- ✅ Seed phrase stored in **browser localStorage** (same-origin only)
- ⚠️ This is a personal/educational project — do not store large amounts of SOL

---

## Author

**Shubham Goyal** — [github.com/Shubhamgoyalbs](https://github.com/Shubhamgoyalbs)
