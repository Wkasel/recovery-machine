import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Recovery Session - Mobile Cold Plunge & Sauna",
  description: "Book your mobile cold plunge and infrared sauna session with Recovery Machine. Professional recovery therapy delivered to your Los Angeles location.",
  keywords: "book cold plunge, schedule infrared sauna, mobile recovery booking, Los Angeles wellness appointment",
  openGraph: {
    title: "Book Recovery Session - Mobile Cold Plunge & Sauna",
    description: "Professional recovery therapy delivered to your location. Book your cold plunge and infrared sauna session today.",
    type: "website",
    images: [{
      url: "/api/og?title=Book%20Recovery%20Session&description=Mobile%20Cold%20Plunge%20%26%20Sauna",
      width: 1200,
      height: 630,
      alt: "Book Recovery Session - Mobile Wellness Services"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Recovery Session - Mobile Cold Plunge & Sauna",
    description: "Professional recovery therapy delivered to your location. Book your session today."
  }
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}