# ADR-001: Central AI Router and Provider Fallback Chain

## Status
Accepted

## Date
2026-07-03

## Context
The platform requires highly available and safety-filtered AI clinical reasoning capabilities. Relying on a single cloud AI provider exposes the system to potential rate limit exhaustion (quota limits) and transient network failures, which is unacceptable for a clinical decision support tool.

## Decision
We implement a Central AI Router (`AIRouterService` at [src/lib/aiRouter.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/lib/aiRouter.ts)) that handles all AI consult requests. The router evaluates provider health and executes requests using a strict fallback chain:
1. **Google Gemini API** (evaluated first).
2. **DeepSeek / Qwen / GLM / Hugging Face APIs** (tried sequentially if Gemini fails).
3. **Local Ollama** (fallback if cloud services are offline).

## Consequences
- Protects clinical workflows against API outages.
- Requires maintenance of API schemas across different providers.
- Increases system configuration complexity due to multi-provider credentials.
