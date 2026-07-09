# ADR-004: Strict Rate Limiting on AI Router Endpoint

## Status
Accepted

## Date
2026-07-08

## Context
High volume of automated scan requests on clinical router.

## Decision
Implement Next.js middleware token-bucket rate limiting.

## Consequences
Protects Gemini API quotas but introduces 429 status response handling in UI.
