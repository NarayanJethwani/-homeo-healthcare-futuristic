# ADR-002: RAG-supported Caching and Confidence Thresholds

## Status
Accepted

## Date
2026-07-03

## Context
AI processing times and token costs present a significant overhead. Many clinical queries contain common patterns or reference standard definitions that do not require real-time cloud LLM generation. Furthermore, we must guarantee that safety-critical questions are answered with verified static medical knowledge whenever possible.

## Decision
We implement a hybrid caching and retrieval-augmented generation (RAG) pipeline:
1. **Pre-generation RAG Lookup**: All incoming queries are matched against `ragService` to find matching verified knowledge articles.
2. **Confidence Threshold**: If the RAG lookup confidence is $\ge 90\%$, the system returns the local answer directly, bypassing cloud LLM requests.
3. **Response Caching**: Responses are stored in `cacheService` using Redis (with a local, size-limited in-memory `Map` fallback).

## Consequences
- Reduces cloud LLM latency to sub-10ms for cached/RAG-matched queries.
- Guarantees medically audited answers for standard queries.
- Requires robust database sync to keep RAG indexing updated.
