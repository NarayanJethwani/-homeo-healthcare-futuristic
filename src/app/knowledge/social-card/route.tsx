import { ImageResponse } from "next/og";
import { CLINIC_LOGO_PUBLIC_URL } from "@/lib/clinicBranding";

// ImageResponse works in the standard server runtime and avoids the 1 MB
// Edge Function limit imposed by the current Vercel plan.
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawTitle = url.searchParams.get("title") || "Health Knowledge";
  const title = rawTitle.slice(0, 110);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(120deg, #070d31 0%, #173d7a 56%, #236b36 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          width: "100%",
          padding: "64px",
          position: "relative",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: "28px", fontWeight: 700 }}>
            {/* ImageResponse requires a standard img element for the remote public logo. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CLINIC_LOGO_PUBLIC_URL} width="54" height="54" alt="" style={{ borderRadius: "50%" }} />
            <span>Homeo Healthcare</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "940px" }}>
            <div style={{ color: "#a7f3d0", fontSize: "25px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Clinical knowledge, clearly explained
            </div>
            <div style={{ fontSize: "68px", fontWeight: 800, lineHeight: 1.08, marginTop: "20px" }}>{title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#dbeafe", fontSize: "23px" }}>
            Understand first. Explore clinical detail when you need it.
          </div>
        </div>
        <div style={{ position: "absolute", height: "520px", width: "520px", borderRadius: "999px", border: "3px solid rgba(167, 243, 208, 0.3)", right: "-190px", top: "-135px" }} />
        <div style={{ position: "absolute", height: "390px", width: "390px", borderRadius: "999px", border: "3px solid rgba(255, 255, 255, 0.16)", right: "-105px", top: "-70px" }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
