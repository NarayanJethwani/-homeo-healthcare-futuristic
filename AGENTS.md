<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Lucy AI Resilient Routing & Workspace Rules

## Workspace Coordinates
- Next.js Portal Root: `/Users/drnarayanjethwani/Downloads/Website with Antigravity`
- WordPress Plugin Root: `/Users/drnarayanjethwani/.gemini/antigravity/scratch/homeo-premium-injector`

## Resilient Routing Design Guidelines
- Central AI Route: `/src/app/api/consult-ai/route.ts` (calls `AIRouterService`).
- Caching: Centralized in `cacheService.ts` (Redis-supported, falls back to local in-memory Map).
- RAG Lookup: Performed in `ragService.ts` before cloud calls. Confidence threshold $\ge 90\%$ triggers direct local answers.
- Gemini quota chain is executed FIRST; other providers (DeepSeek, Qwen, GLM, Hugging Face) and local Ollama are tried NEXT.
- Rate limiting, prompt injection defense, and medical safety crisis filters are active.

