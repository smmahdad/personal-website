import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.domain}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#100e0b",
          color: "#f4ecdc",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.22em",
            color: "#d4a45a",
          }}
        >
          {site.domain}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#a89b86",
              maxWidth: 820,
            }}
          >
            {`${site.currentRole.title} at ${site.currentRole.company}. Previously Rippling Spend and Amazon Ads.`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#6f6658",
          }}
        >
          <div style={{ display: "flex" }}>{site.location}</div>
          <div style={{ display: "flex" }}>p99 3.5s → 600ms</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
