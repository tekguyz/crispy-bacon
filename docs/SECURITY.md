
# 🛡️ Privacy & Security
**Standard:** Owner-Only Access
**Encryption:** AES-256 Cloud Secure

## 1. Access Rules
We enforce a strict **"My Data"** policy using database-level security rules.
- **Profiles:** You can only read or write your own profile.
- **Notes:** Data is strictly partitioned. One user cannot access another user's notes under any circumstance.
- **Identity:** Every request is verified against a secure session token before any data is returned.

## 2. Privacy Standards
- **No Training:** Your private notes are **never** used to train general AI models.
- **Temporary Processing:** Analysis happens in memory and is encrypted during transit. The AI forgets the context as soon as the note is finished.
- **Complete Deletion:** When you delete a note, it is wiped from our systems instantly (Cloud + Database).

## 3. Sharing & Collaboration
Shared links use secure, unguessable identifiers.
- **Collaboration:** "Live Sync" enables real-time task tracking across teams.
- **Expiry:** Links can be configured to self-destruct (24h / 7 Days).
- **Access:** Public links are read-only unless specifically authorized for collaboration.
