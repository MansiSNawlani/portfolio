import { ImageResponse } from "next/og";

export const alt = "Mansi S. Nawlani, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "#0f1a24",
        color: "#f2f5f4",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, color: "#7fa3c6", letterSpacing: 2 }}>
        MANSISN.COM
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
          Mansi S. Nawlani
        </div>
        <div style={{ fontSize: 40, color: "#a9b4b2" }}>
          Senior Software Engineer · React · .NET · AI products
        </div>
      </div>
      <div style={{ fontSize: 26, color: "#a9b4b2" }}>
        8 years of enterprise software · AWS Certified · Based in Germany
      </div>
    </div>,
    size,
  );
}
