# **$IDRA WHITEPAPER**

## **Disclaimer**

The information contained in this whitepaper is for general informational purposes only. It is subject to updates as the project evolves and does not constitute investment advice, legal counsel, or solicitation. IDRA remains under active development, and specifications, features, and deployment timelines may change without prior notice. Nothing herein creates any offer to sell or solicitation of an offer to buy any security, nor does it guarantee future performance.

## **Abstract**

Blockchain has unlocked new models of finance, enabling trustless, programmable, and borderless transactions. Yet mainstream adoption is limited by the volatility of traditional cryptocurrencies. Stablecoins provide a solution—delivering the transparency and efficiency of blockchain while maintaining fiat-denominated stability.

**IDRA** is a multichain stablecoin pegged 1:1 to the Indonesian Rupiah (IDR). Unlike USD-centric stablecoins, IDRA is designed specifically for the Indonesian and Southeast Asian market, enabling **on-chain hedging, foreign exchange (FX) settlement, and participation in decentralized finance (DeFi)**.

IDRA will launch across **Ethereum Layer-2s, Polygon, BNB Chain, and Solana**, with a roadmap toward **Monad, Cosmos IBC, and other high-performance ecosystems**. Built with a **multi-signature security model, off-chain verification for minting and burning, and fiat-collateralized reserves stored in Indonesian government-approved treasuries and licensed domestic banks**, IDRA aims to provide trust, resilience, and interoperability.

By anchoring the Indonesian Rupiah to the decentralized economy, IDRA creates new opportunities for traders, institutions, and builders to leverage IDR on-chain.

## **2\. The Case for Stablecoins**

Stablecoins have become one of the most important innovations in the digital asset economy, serving as the bridge between traditional money and decentralized finance. They combine the transparency, programmability, and efficiency of blockchain with the stability of government-backed fiat currencies. This dual nature makes stablecoins indispensable for the next phase of financial innovation.

The benefits are clear. Stablecoins provide **price stability**, allowing users and institutions to engage in blockchain-based finance without being exposed to crypto volatility. They offer **global accessibility**, enabling individuals and businesses to transact and settle across borders with minimal friction. They deliver **efficiency**, compressing settlement from days to seconds, and reduce reconciliation and counterparty risks. Their **programmability** allows developers to embed money into smart contracts, unlocking new models of finance from automated market makers to decentralized credit markets.

**Why now?** Around the world, regulators are moving toward formal frameworks for fiat-backed stablecoins, validating their importance in modern finance. **Hong Kong’s stablecoin licensing regime** positions the city as a hub for regulated digital money in Asia, while in the United States the **Clarity for Payment Stablecoins Act** (informally nicknamed the “Genius Act”) has advanced the conversation on national-level guardrails for issuance, reserves, and supervision. These initiatives reflect a global recognition that stablecoins are becoming regulated financial instruments.

### **Indonesia’s momentum**

Indonesia is uniquely positioned to embrace this trend. With one of the largest crypto user bases globally, a vibrant fintech sector, and a fast-growing digital economy, the demand for a rupiah-backed stablecoin is clear. Regulators are preparing the ground: **OJK’s expanding regulatory sandbox** allows innovative financial products—including blockchain-based assets—to be tested under supervision, and **Bank Indonesia’s exploration of a digital rupiah (CBDC)** signals that the national currency will require a secure, programmable on-chain representation. Yet the current market is dominated by USD-pegged tokens (e.g., USDT, USDC), which exposes Indonesian users to external regulatory and macro dynamics.

**IDRA** addresses this by bringing **IDR directly on-chain** under local compliance, with reserves anchored in **Indonesian-approved treasuries and licensed banks**. The convergence of global regulatory clarity, strong local demand, and domestic supervisory experimentation signals that **now is the right time** for a regulated, institution-grade IDR stablecoin.

## **3\. Transformation of Technology**

The internet has undergone a profound transformation over the last three decades. In its earliest stage, often referred to as Web1, it consisted of static websites and one-directional information flow; a digital library to read rather than engage. The shift to Web2 marked the rise of dynamic, interactive platforms. Users generated and shared their own content, and global platforms grew into massive ecosystems that shaped communication, commerce, and culture. While this transformation created unprecedented convenience and connectivity, it also concentrated data and power in a handful of corporations, raising concerns around surveillance, censorship, and fragility.

Web3 represents a corrective shift. It leverages blockchain to decentralize control, reduce dependence on intermediaries, and restore sovereignty over data and assets to individuals and communities. This decentralized internet enables peer-to-peer interaction that is secure, transparent, and programmatic. However, the volatility of first-generation cryptoassets has limited their use as a transactional or treasury unit of account.

Stablecoins bridge that gap. By pegging digital tokens to fiat currencies, they combine the benefits of decentralized infrastructure with the predictability of money. They have quickly become foundational components of Web3—powering DeFi, on-chain liquidity, and cross-border settlement. In the Indonesian context, a rupiah-backed stablecoin like IDRA is not merely a technical innovation but a necessity for integrating the national currency into the decentralized global economy.

## **4\. IDRA Overview**

**Definition.** IDRA is a **fully-collateralized, fiat-backed stablecoin** pegged at **1 IDRA \= 1 IDR**.

**Core properties.**

- **Price stability.** Always redeemable 1:1 for IDR through authorized channels.
- **Transparency.** Independent monthly attestations and a real-time proof-of-reserves dashboard.
- **Multichain issuance.** Native deployments on Ethereum, Base, BNB Chain, and Solana; roadmap includes Monad and Tron.
- **Security.** Role-segmented multi-signature governance; immutable audit trails.
- **Compliance.** KYC/KYB for all fiat mint/redemptions; policies aligned with the OJK/BI sandbox.

**Collateral model.** IDRA is backed by **Indonesian Rupiah reserves** held with **licensed Indonesian banks** and **Indonesian government-approved treasury instruments** (e.g., short-term treasury bills and equivalent highly liquid, low-risk instruments). A limited portion of reserves may be held in top-tier fiat-backed stablecoins (e.g., USDC/USDT) to facilitate on-chain liquidity and redemptions across global corridors.

## **5\. Technical Architecture**

IDRA’s technical design ensures secure issuance, transparent redemption, and interoperability across multiple blockchain ecosystems. The system comprises: (i) a smart-contract suite; (ii) role-based governance with multi-signatures; and (iii) a **mint/redeem dashboard** that bridges fiat, other stablecoins, and on-chain liquidity at **mid-market** FX rates.

### **5.1 Blockchain infrastructure**

- **Launch networks:** Ethereum, Base, BNB Chain, Solana.
- **Roadmap:** Monad (parallelized EVM), Cosmos IBC (interoperable DeFi), and other high-throughput chains.
- **Token standards:** ERC-20 (EVM), BEP-20 (BNB Chain), SPL (Solana), and IBC-compatible representations in Cosmos.

**Decimals & metadata.** EVM deployments default to 18 decimals; Solana uses SPL conventions. Chain-specific metadata (name, symbol, decimals) and contract addresses are published in an appendix and on the dashboard.

### **5.2 Supply model and multichain coherence**

**Canonical supply ledger.** Total circulating supply is tracked at the issuer level and reconciled across chains. Each chain has a **per-chain mint cap**, configurable by governance, to contain risk. Bridging between chains uses either (a) **native mints** authorized by the issuer on each chain, or (b) **wrapped representations** minted against burns on an origin chain through an approved bridge. In either case, the sum of all native and wrapped supplies **must not exceed** reserves.

**Bridging posture.** IDRA prioritizes issuer-controlled/native minting on supported chains. Where third-party bridges are used for wrapped representations, they must meet governance-approved security, monitoring, and incident-response thresholds.

### **5.3 Smart contracts for minting and burning**

**Contract suite (EVM):**

- **IDRA Token** (ERC-20): core token with pause, blacklist/freeze, and permit (EIP-2612) extensions to support compliance and efficient UX.
- **MinterGateway:** permissioned contract callable only by authorized roles to **mint** IDRA upon verified collateral receipt.
- **RedeemGateway:** permissioned contract to **burn** IDRA sent for redemption; emits burn receipts for off-chain payout.
- **Roles & AccessControl:** OWNER (role assignment & policy changes), ADMIN (operational mint/burn), PAUSER (emergency controls).
- **Eventing:** all mint/burn/role-change operations emit structured events to support real-time monitoring and auditability.

**Thresholds & approvals.** Operational safety uses multi-signature approvals at the contract layer:

- **≤ 10,000,000 IDRA** per transaction requires **2-of-3** Administrator approvals.

- **\> 10,000,000 IDRA** or role/parameter changes require **3-of-4** approvals (Owner \+ Admins).

These patterns mirror proven, production-grade stablecoin controls and the multi-signature approach described in the referenced industry document.

**Burn mechanics.** Redemptions are initiated by transferring IDRA to the **RedeemGateway** (or chain-specific burn address). Tokens are **irreversibly burned** on-chain; a signed burn receipt maps to the off-chain payout (fiat IDR or approved stablecoin), closing the loop.

### **5.4 Dashboard for minting and redemption (mid-market FX)**

A unified **dashboard** serves individuals and institutions:

- **Mint from IDR.** Verified users initiate deposits to designated reserve accounts. Upon confirmed receipt and compliance checks, the dashboard orchestrates a multi-sig mint via **MinterGateway** and delivers IDRA on the user’s chosen chain. **KYC/KYB is mandatory** for any mint or redemption that touches fiat IDR.
- **Mint/Redeem via other stablecoins.** Users may convert between IDRA and approved stablecoins (e.g., USDT/USDC) at the **mid-market rate**, less disclosed conversion and network fees. The dashboard aggregates oracle data (multiple liquidity venues, centralized FX benchmarks, and on-chain AMM quotes) and applies circuit breakers and slippage limits for fairness.
- **Transparency.** Real-time circulating supply, reserve composition (banks, treasuries, any stablecoin liquidity), pending mint/redeem requests, and historical on-chain issuance/burn activity are displayed. Exportable CSVs and APIs allow institutions to automate reconciliation.

### **5.5 KYC, data protection, and sandbox alignment**

**KYC/KYB.** All users and institutions minting or redeeming **in fiat IDR** must pass KYC/KYB under **Indonesian regulatory requirements** and in alignment with **OJK/BI sandbox** expectations. Individuals provide government ID and liveness checks; institutions provide corporate documents, licenses, and ultimate beneficial ownership (UBO) disclosures. For **on-chain stablecoin conversions** (IDRA ↔ USDT/USDC), thresholds may allow lighter-weight flows, subject to policy and law.

**Data protection.** Personal data processing follows Indonesia’s **PDP Law** principles (purpose limitation, data minimization, retention limits, security, and subject rights). Compliance policies and privacy notices are published on the dashboard.

### **5.6 Security and audits**

- **Operational controls.** Mint/burn are governed by **multi-signature** approvals baked into the contracts; no single key can change supply.
- **Monitoring.** On-chain events stream to a SIEM; anomalous activity triggers automated pauses via PAUSER role subject to governance ratification.
- **Audits & bounties.** Independent, top-tier firms audit contracts pre-deployment and on significant upgrades. A public bug bounty program encourages responsible disclosure.
- **Upgradeability.** Where proxy patterns (e.g., UUPS/Transparent) are used, upgrades require enhanced quorum (e.g., 3-of-4) and a minimum timelock; immutable core constraints (e.g., total supply ≤ reserves) are enforced at the policy layer.

## **6\. Reserve Management & Transparency**

IDRA’s credibility rests on rigorous reserve management and disclosures. Every IDRA in circulation is fully backed by an equivalent amount of off-chain assets held with regulated custodians and in **Indonesian government-approved treasuries**.

### **6.1 Reserve composition**

- **Bank deposits (IDR).** Segregated accounts at **licensed Indonesian banks**.
- **Indonesian treasuries.** Short-duration, highly liquid government-approved instruments (e.g., treasury bills) to enhance safety and liquidity.
- **Stablecoin liquidity (limited).** A capped portion in top-tier fiat-backed stablecoins to facilitate cross-border on-/off-ramps and on-chain conversions.

The allocation policy targets principal safety, daily liquidity, and full coverage of circulating supply.

### **6.2 Custody and safeguards**

Reserves are **ring-fenced** from operating funds. Mandates restrict usage solely to backing IDRA liabilities and redemption. Over time, insurance and/or bank guarantees may be layered on. Counterparty concentration limits and duration buckets are enforced by policy.

### **6.3 Proof of reserves**

- **Monthly independent attestations.** A third-party accounting firm verifies reserve balances (banks, treasuries, stablecoin liquidity) against circulating supply; reports are published.
- **Real-time dashboard.** Live circulating supply and reserve breakdowns are displayed with data-source provenance. Institutional APIs enable automated checks.

### **6.4 Redemption assurance**

Any holder who has completed KYC/KYB may redeem IDRA for **IDR at par** through authorized channels. Redemptions into approved stablecoins are executed at **mid-market** rates (less fees), subject to liquidity and policy. All redemptions correspond to on-chain **burns**, ensuring supply decreases as liabilities are settled.

### **6.5 Regulatory compliance**

Reserve practices align with **Bank Indonesia** and **OJK sandbox** expectations. Documentation (audit letters, account attestations, treasury statements) is maintained for supervisory review. Policies are updated as Indonesian regulations evolve.

## **7\. Governance**

Governance prioritizes security, compliance, and transparency.

- **Roles.** OWNER controls role assignments and high-impact parameters; ADMIN executes operational mint/burn within policy; PAUSER can halt token transfers in emergencies.
- **Quorums.** Operational mints/burns ≤ 10M IDRA require **2-of-3 Admin** approvals; large issuances, parameter changes, or role updates require **3-of-4** (Owner \+ Admins).
- **Change management.** New chains, reserve allocation changes, bridge approvals, and contract upgrades follow documented proposals, risk assessments, and public notices.
- **Compliance-first posture.** Early-phase governance is corporate and regulator-centric. Community input channels may be added once institutional safeguards are mature.

(Thresholded multi-signature controls are consistent with the approach documented in the referenced industry whitepaper.)

## **8\. Use Cases**

### **8.1 Stability hedging**

IDRA functions as a stability instrument for market participants with exposure to IDR. Traders and institutions can rotate into IDRA during macro uncertainty, preserving IDR-par value on-chain while retaining access to digital markets. Because redemptions are available at par for verified users, IDRA provides credible hedging for cash management and treasury diversification without exiting the crypto ecosystem.

### **8.2 On-chain foreign exchange (FX)**

IDRA enables programmable FX across Southeast Asia’s corridors. Through liquidity pools and venue integrations, users can swap IDRA against major stablecoins (e.g., USDT/USDC) and regional units (e.g., SGD- or VND-based stablecoins). These markets operate 24/7 with transparent pricing, mid-market quotes on the dashboard, and deterministic settlement. Institutions gain an auditable, fast, and composable FX rail for trade flows, remittance aggregation, and treasury rebalancing.

### **8.3 Access to DeFi**

As a fiat-stable, multichain asset, IDRA fits naturally into DeFi. It can be posted as collateral to borrow other assets, supplied as liquidity to AMMs and lending markets to earn yield, or used in structured products (e.g., on-chain money markets, hedging strategies). For treasuries, IDRA provides a programmable, policy-constrained unit to interact with global liquidity while maintaining IDR exposure.

## **9\. Risk Management**

**Smart-contract risk.** Mitigated via independent audits, continuous monitoring, conservative upgrade paths, and a public bug bounty.

**Peg risk.** Addressed by 100% reserve coverage, conservative investment policy (banks \+ Indonesian treasuries), and transparent attestations.

**Regulatory risk.** Managed through alignment with OJK/BI sandbox requirements, adaptable policies, and proactive engagement with supervisors.

**Operational risk.** Reduced by role-segregated multi-signature controls, incident response playbooks, change-management discipline, and tested fail-safes (pauses, per-chain caps).

## **10\. Roadmap**

**Q4 2025\.** Launch IDRA on Ethereum, Base, BNB Chain, and Solana; go-live proof-of-reserves dashboard; initial DeFi venue integrations.

**Q1 2026\.** Indonesian exchange listings; institutional onboarding; on-chain FX pools with mid-market routing.

**Q2 2026\.** Corridor expansion (SGD, VND stablecoin pairs); API tooling for treasury ops; additional custodial partners.

**Q3 2026\.** Deploy on Monad and Cosmos IBC; approve first set of IBC channels/relayers.

**Q4 2026\.** Broaden DeFi integrations (lending markets, derivatives margin support); publish annual security & reserve report.

**2027+.** Institutional adoption at scale; interoperability with CBDC pilots where permitted; broaden attestation cadence and insurance layers.

## **11\. Conclusion**

IDRA is designed as a **financial stability instrument** for Web3, not a consumer payments token. By combining an IDR peg, multichain issuance, Indonesian treasury-backed reserves, compliance-aligned KYC/KYB, and robust multi-signature governance, IDRA gives traders, institutions, and DeFi participants a credible way to hedge IDR exposure, settle programmable FX, and access on-chain financial markets.

As Indonesia’s digital economy accelerates and supervisory frameworks mature, an IDR-native, transparent, and compliant stablecoin can become the **digital foundation of rupiah liquidity on-chain**. IDRA aims to be that foundation.

###

###

###

###

###

###

### **Appendix A: Compliance & Policy Snapshot (summary)**

- **KYC/KYB:** Mandatory for all mints/redemptions involving **fiat IDR**; thresholds for on-chain conversions set by policy.
- **Travel Rule:** Implemented for applicable transfers via approved providers.
- **Privacy:** Indonesian PDP Law principles applied; retention and minimization policies enforced.
- **Sanctions/blacklist:** Contract-level hooks (freeze/blacklist) and screening at onboarding.

### **Appendix B: Contract Surfaces (EVM)**

- IDRA: ERC-20 with permit, pause, freeze/blacklist.
- MinterGateway: permissioned minter; emits Minted(address to, uint256 amount, bytes32 ref).
- RedeemGateway: burns and emits BurnReceipt(address from, uint256 amount, bytes32 ref).
- AccessControl: roles/quorums; timelock for sensitive changes.
- **Per-chain caps** and **supply registry** ensure aggregate supply ≤ verified reserves.
