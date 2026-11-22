---
title: Changelog
description: Versions of the Veridact specification and the Valet profile, and what changed in each.
---

## Veridact specification

### 0.5 (draft) · 22 November 2026

Moves Veridact from W3C VC Data Model 2.0 with did:webvh to the formats the IETF OAuth working group is standardising. The trust model, tiers, ACME-A, delegation, sub-agents, the transparency log and the verification order are unchanged. The reference packages implement it, and the staging network was reset for the switch.

- Credentials are **SD-JWT VCs**, with operator legal facts selectively disclosable.
- A presentation is an **SD-JWT+KB** carrying only the Agent Credential, which now holds the operator facts and the operator's status.
- Identifiers are **HTTPS URLs**. An agent's identifier is its **Client ID Metadata Document** URL, which is also its OAuth `client_id`.
- **Key events** in the transparency log replace did:webvh pre-rotation.
- Revocation uses the **Token Status List**, with a distinct suspended state.
- New presentation pattern C: **attestation-based client authentication**.
- New **Known-Assistant Credentials** identify mainstream assistants such as Claude and ChatGPT, with a kill switch, without their platforms taking part.

[Full list of changes](/docs/veridact/spec/#appendix-a-changes-from-v04) · [Proposal](/docs/veridact/proposals/v0-5-sd-jwt-vc/)

### 0.4 · 19 November 2026

Sub-agent grants that can only narrow authority, actor claims in access tokens, Agent Certificates for mutual TLS, and archival verification with timestamped Verification Records. [Proposal](/docs/veridact/proposals/v0-4-iiw42/)

### 0.3

Gaps found while building the issuer, vbot and the gateway integrations: the key-binding JWT, delegation claims, ordering rules, log receipts and nonces for token exchange. [Proposal](/docs/veridact/proposals/v0-3-issuer-gaps/)

### 0.2

Gaps found while building the reference verifier: delegation limits, operator status, the trust list format, presentation encoding and new public codes. [Proposal](/docs/veridact/proposals/v0-2-verifier-gaps/)

## Valet profile

### valet-profile/0.8 · 17 November 2026

The current profile: three permission types, three access levels, named approval rules with machine-readable reasons, a fixed check order on every call, error codes and the signed receipt format, with personal data kept outside the receipt chain. [Read the profile](/docs/valet/profile/)
