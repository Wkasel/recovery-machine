import { siteMetadata } from "@/config/metadata";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? siteMetadata.defaultTitle;
    const type = searchParams.get("type") ?? "default";
    const description = searchParams.get("description") ?? siteMetadata.description;

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
            backgroundColor: "#0f172a",
            backgroundImage: "linear-gradient(45deg, #0f172a 0%, #1e293b 100%)",
            padding: "40px 60px",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: "white",
              lineHeight: 1.2,
              whiteSpace: "pre-wrap",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {/* Description (if type is not minimal) */}
          {type !== "minimal" && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 400,
                color: "#94a3b8",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                textAlign: "center",
              }}
            >
              {description}
            </div>
          )}
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