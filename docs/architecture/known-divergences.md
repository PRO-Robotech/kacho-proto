# kacho-proto — known divergences & documented by-design decisions

This file records deliberate design decisions in the wire contract that could
otherwise be mistaken for defects by a security/architecture audit. Each entry
states the rule it touches, why the current shape is intentional, and the
invariant the **backend owner** must uphold (kacho-proto is contract-only; it
carries no runtime, so enforcement lives in the owning service — here
`kacho-compute`).

The `.proto` wire contract is FROZEN. Nothing in this file authorises a proto
edit; it documents why a flagged shape is acceptable as-is and what the
consuming service must guarantee.

---

## KD-1 (resolved / superseded) — Public `Instance` no longer exposes dedicated-host placement ids

- **Where**: `proto/kacho/cloud/compute/v1/instance.proto`
- **History**: `host_group_id` (27) and `host_id` (28) were originally exposed on
  the public `Instance` message and, in an earlier pass, documented here as
  "accepted by-design" for the single-tenant dedicated-host product (the tenant
  owns the host, so no cross-tenant co-residency inference).
- **Current contract**: both field **numbers and names** are now `reserved` on the
  public `Instance` message:

  ```protobuf
  reserved 27, 28;
  reserved "host_group_id", "host_id";
  ```

  The stricter decision won: "which physical host an instance is placed on" is
  infra-sensitive (see workspace `CLAUDE.md` §"Инфра-чувствительные данные —
  ТОЛЬКО во внутреннем API" / ban §6, CWE-200) and is withheld from the public
  projection outright rather than conditionally populated. If this placement is
  ever needed it must be surfaced only via an `Internal*`-only projection on
  :9091 — never re-added to the public message (numbers/names are permanently
  reserved).
- **Disposition**: the earlier "by-design exposure" rationale is **superseded**.
  There is **no live divergence** — the public surface exposes no dedicated-host
  placement id, so nothing here needs a kacho-compute populate-time invariant
  anymore. No proto change is required or permitted here.
