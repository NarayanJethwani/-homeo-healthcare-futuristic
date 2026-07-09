# Release Notes - v2.7.0 (Persistent Vector Store & Production RAG Indexing)

## Release Information
- **Release Version**: `2.7.0`
- **Release Tag**: `v2.7.0-persistent-vector`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Clean Next.js static build success

## Summary of Changes
V2.7.0 replaces session-only memory RAG vector retrieval with a persistent, production-ready storage architecture.

### 1. Hybrid Persistent Vector Store
- Developed `HybridPersistentVectorStore` implementing standard database query fallback interfaces.
- Utilizes Google Firestore as primary vector persistence engine, falling back to local memory if Firestore is offline.
- Fully isolates unapproved editorial drafts from retrieval indexes.

### 2. Embedding & Indexing Queue
- Implemented background embedding job queue.
- Jobs are executed asynchronously, maintaining status (Pending, Succeeded, Failed) and retrying up to 3 times on quota errors.
- Triggers automatic index updates when CMS publishes or rolls back content.

### 3. RAG Observability Tab
- Added dedicated RAG health cockpit panel.
- Shows total indexed vectors, failed queue items, stale vectors, and offers manual trigger utilities.
