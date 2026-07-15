import { NextRequest } from "next/server";
import { createConsultAIHandler, prodDeps } from "@/features/ai-security/access/consultAIHandler";
import { handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";

export const OPTIONS = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin);
};

export const POST = createConsultAIHandler(prodDeps);
