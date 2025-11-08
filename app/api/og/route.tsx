import { siteMetadata } from "@/config/metadata";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? siteMetadata.defaultTitle;
    const type = searchParams.get("type") ?? "default";

    // Fetch the van image and logo
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://therecoverymachine.co";
    const vanImageUrl = `${baseUrl}/recovery-van.png`;
    const logoUrl = `${baseUrl}/logo.png`;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fffa", // mint background
            backgroundImage: "linear-gradient(180deg, #f8fffa 0%, #dcfce9 50%, #c4f4d8 100%)", // mint gradient
            padding: "60px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "40px",
              left: "60px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo"
              width="120"
              height="120"
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          {/* Main Title - "WELLNESS THAT COMES TO YOU" */}
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#292f2a", // charcoal
              lineHeight: 1.1,
              textAlign: "center",
              marginBottom: 40,
              maxWidth: "900px",
            }}
          >
            WELLNESS THAT COMES TO YOU
          </div>

          {/* Van Image */}
          <div
            style={{
              display: "flex",
              width: "600px",
              height: "auto",
              marginBottom: 30,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={vanImageUrl}
              alt="Recovery Van"
              width="600"
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          {/* Subtitle/Page Title (if provided and different from default) */}
          {title !== siteMetadata.defaultTitle && (
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 400,
                color: "#292f2a", // charcoal
                lineHeight: 1.3,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              {title}
            </div>
          )}

          {/* Accent Line */}
          <div
            style={{
              display: "flex",
              width: "100px",
              height: "3px",
              backgroundColor: "#a0e5b3", // mint-accent
              marginTop: 20,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
