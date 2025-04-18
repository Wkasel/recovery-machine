import { siteMetadata } from "@/config/metadata";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? siteMetadata.defaultTitle;
    const type = searchParams.get("type") ?? "default";
    const description = searchParams.get("description") ?? siteMetadata.description;

    // Font loading
    const interBold = await fetch(
      new URL("../../../public/fonts/Inter-Bold.ttf", import.meta.url)
    ).then(async (res) => res.arrayBuffer());

    const interRegular = await fetch(
      new URL("../../../public/fonts/Inter-Regular.ttf", import.meta.url)
    ).then(async (res) => res.arrayBuffer());

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
            backgroundColor: "white",
            padding: "40px 60px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteMetadata.organization.logo}
              alt={siteMetadata.organization.name}
              width={80}
              height={80}
            />
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontFamily: "Inter Bold",
              letterSpacing: "-0.05em",
              color: "black",
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
                fontFamily: "Inter Regular",
                color: "gray",
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
        fonts: [
          {
            name: "Inter Bold",
            data: interBold,
            style: "normal",
            weight: 700,
          },
          {
            name: "Inter Regular",
            data: interRegular,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
