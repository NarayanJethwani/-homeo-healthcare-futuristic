import { NextRequest } from "next/server";
import { ipAddress } from "@vercel/functions";

export type IpResolver = (request: NextRequest) => string;

/**
 * Production Vercel Client IP resolver wrapping the hosting provider's API.
 * Returns "IP_UNRESOLVABLE" on failure or missing IP.
 */
export const vercelIpResolver: IpResolver = (request: NextRequest): string => {
  try {
    const ip = ipAddress(request);
    return ip || "IP_UNRESOLVABLE";
  } catch (err) {
    return "IP_UNRESOLVABLE";
  }
};
