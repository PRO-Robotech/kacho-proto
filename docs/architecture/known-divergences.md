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

## KD-1 — Public `Instance` exposes dedicated-host placement ids (`host_id`, `host_group_id`)

- **Where**: `proto/kacho/cloud/compute/v1/instance.proto`
  - `string host_group_id = 27;` — "ID of the dedicated host group that the instance belongs to."
  - `string host_id = 28;` — "ID of the dedicated host that the instance belongs to."
- **Rule touched**: project infra-leak hard rule — "which physical host an
  instance is placed on" is infra-sensitive and normally belongs to
  `Internal*`-only projections, never the tenant-facing surface
  (see workspace `CLAUDE.md` §"Инфра-чувствительные данные — ТОЛЬКО во
  внутреннем API"). Audit standard: CWE-200.

### Why this is by-design (not a defect)

These two ids exist **only** for the dedicated-host product, where the physical
host is *rented by and owned by the reading tenant itself* (single-tenant host).
In that model:

- The tenant already owns the host, so returning its id discloses nothing about
  *other* tenants.
- No cross-tenant co-residency inference is possible, because a dedicated host
  by definition hosts only one tenant. The lateral-movement / co-residency
  mapping scenario the infra-leak rule guards against does not arise.

This mirrors the public dedicated-host contract users expect (host ids are part
of the dedicated-host management surface the tenant operates against).

### Load-bearing backend invariant (owner: kacho-compute)

The safety of exposing these fields depends entirely on **when** they are
populated. The `kacho-compute` backend MUST guarantee:

1. `host_id` and `host_group_id` are populated **only** for instances placed on
   a dedicated host **owned by the reading tenant** (tenant-rented dedicated
   placement).
2. For any instance scheduled on **shared / managed (non-dedicated) hardware**,
   both fields are always the empty string in every public
   (non-`Internal*`) response — the placement of shared hardware is never
   revealed.
3. This is enforced at the point the public `Instance` projection is built
   (not merely by convention on the write path), and is covered by a test that
   asserts a shared-host instance projects `host_id == "" && host_group_id == ""`.

If invariant (2) is ever violated — i.e. `host_id` is filled for a shared-host
instance — a tenant reading its own `Instance` would learn the physical host of
shared hardware, enabling co-residency mapping of co-tenants. That would be a
real infra-leak and MUST be treated as a `bug` in `kacho-compute`, not a
contract change here.

### Status

- Contract impact: **none** (no proto change required or permitted).
- Disposition: **accepted by-design**, conditional on the kacho-compute
  invariant above. Reviewer of the compute projection is responsible for
  confirming the invariant holds and the test exists.
- Source finding: SEC / low / confidence low — "Public Instance message exposes
  dedicated-host placement ids (host_id / host_group_id)".
