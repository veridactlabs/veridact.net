---
title: Introduction
description: Veridact and Veridact Valet are open specifications and reference code that let AI agents act for organisations and their customers without shared passwords.
---

When an AI agent calls a bank's API, the bank needs answers to three questions before it serves the request:

1. **Which organisation operates this agent, and answers for it?**
2. **What has that organisation allowed the agent to do?**
3. **What has this customer allowed the agent to do with their account?**

Passwords and API keys answer none of them. Two open projects do.

| | Veridact | Veridact Valet |
|---|---|---|
| Answers | Questions 1 and 2: *which agent is this, who answers for it, and is it still trusted?* | Question 3: *what did the customer allow?* |
| What it is | An open specification for short-lived agent credentials, issued the way Let's Encrypt issues certificates, plus a reference verifier, issuer and agent client | An open permission profile for agent access to accounts, plus a reference implementation a bank deploys and runs itself |
| Built on | SD-JWT VC, Token Status List, Client ID Metadata Documents, ACME (RFC 8555) | OAuth 2.0 Rich Authorization Requests, FAPI 2.0, DPoP, CIBA |
| Read first | [Specification](/docs/veridact/spec/) | [Overview](/docs/valet/overview/), then [Where Valet fits](/docs/valet/where-valet-fits/) |

[How Veridact and Valet fit together](/docs/guides/how-they-fit/) walks through one request that uses both.

## What these docs contain

- **[Veridact specification](/docs/veridact/spec/)**: the normative specification. Identifiers and keys, the credentials, delegation and sub-agents, the ACME-A issuance protocol, presenting to a relying party, the verification checks, revocation, the trust registry, security and privacy.
- **[Veridact Valet](/docs/valet/overview/)**: the Valet profile (the shared permission standard every deployment implements), the technical design, the threat model, and the designs still in draft.
- **Guides**: running the Valet proof of concept, its Keycloak extension, and deploying it.
- **[Proposals](/docs/veridact/proposals/v0-5-sd-jwt-vc/)**: how each Veridact version came about, and why.

Every page is built from the markdown in the [veridactlabs](https://github.com/veridactlabs) repositories, and each says which commit it came from. **Copy page** copies a page as markdown, for an AI assistant or a review.

## Reading the specifications

The key words MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, NOT RECOMMENDED, MAY and OPTIONAL are to be interpreted as described in BCP 14 ([RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)) when, and only when, they appear in all capitals. They are highlighted on specification pages so obligations are easy to find.

Valet documents mark each feature **Built** (in the proof of concept and covered by a test) or **Specified** (part of the design, not yet built).

## Status

Both projects are drafts for review, with working proofs of concept. Nothing here is accredited or conformance-tested for production yet.

- **Veridact**: specification v0.5 (draft). The reference code is moving to v0.5 package by package. The issuer, vbot, sidecar and sandbox run as an alpha staging network.
- **Veridact Valet**: profile `valet-profile/0.8`, implemented by the proof of concept and its conformance tests.

Marula Bank, Kaya and Thandi, who appear in the Valet examples, are fictional, as are all account numbers.

## Get involved

Both projects are Apache 2.0 licensed and built only on open standards. Feedback on the drafts is welcome as GitHub issues on [veridact](https://github.com/veridactlabs/veridact/issues) or [veridact-valet](https://github.com/veridactlabs/veridact-valet/issues). Report security problems in the design through each repository's SECURITY.md, not in a public issue.

Banks, insurers and agent builders interested in a pilot can write to [hello@veridact.net](mailto:hello@veridact.net). Commercial support, integration help and assurance are available from IAME (IAM Experts). Nobody needs a contract to use the code or the specifications.
