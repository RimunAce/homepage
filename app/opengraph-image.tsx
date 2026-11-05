import { ImageResponse } from "next/og";

export const alt = "Respire. Live, Love, Accept. Enjoyer of many, hater of none(?).";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FFB6C1",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            background: "#E0E0E0",
            border: "8px solid #000000",
            boxShadow: "16px 16px 0 #000000",
            padding: 56,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 2 }}>
            RESPIRE.MY
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1 }}>
              RESPIRE
            </div>
            <div style={{ display: "flex", fontSize: 32, marginTop: 24, maxWidth: 860 }}>
              Live, Love, Accept. Enjoyer of many, hater of none(?).
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24 }}>Developer and Forester</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
