# 🛡️ The Vault Protocol
**Standard:** Owner-Only Access
**Encryption:** AES-256 Cloud Secure

## 1. Access Control
The database is hardened using Row Level Security (RLS). We enforce a strict **"My Data"** policy.
- **Profiles:** Users can only read/write their own profile.
- **Research Nodes:** Data is strictly partitioned. User A cannot access User B's nodes under any circumstance.
- **Functions:** Backend logic verifies JWT ownership before execution.

## 2. Privacy Standards
- **Zero Training:** Your private notes are **never** used to train general AI models.
- **Ephemeral Processing:** Analysis happens in memory and is encrypted during transit.
- **Purge Control:** When you delete a note, it is wiped from our systems instantly (Cloud + Database).

## 3. Sharing Logic
Shared links use cryptographically secure slugs.
- **Collaboration:** "Live Sync" enables real-time task completion tracking across teams.
- **Expiry:** Links can be configured to self-destruct (24h / 7 Days).
- **Access:** Public links are read-only unless specifically authorized for collaboration.