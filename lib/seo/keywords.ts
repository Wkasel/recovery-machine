// Wellness and Recovery Keywords for SEO Optimization
export const wellnessKeywords = {
  primary: [
    "mobile cold plunge",
    "infrared sauna delivery",
    "recovery therapy",
    "wellness services",
    "mobile spa",
    "cold therapy",
    "heat therapy",
    "recovery machine",
  ],
  secondary: [
    "cold plunge therapy",
    "infrared sauna sessions",
    "mobile wellness",
    "recovery services",
    "cold water therapy",
    "sauna rental",
    "wellness coaching",
    "athletic recovery",
    "performance recovery",
    "mobile recovery",
  ],
  longTail: [
    "mobile cold plunge rental Los Angeles",
    "infrared sauna delivery service",
    "cold plunge therapy at home",
    "mobile wellness services LA",
    "recovery therapy at your location",
    "professional cold plunge sessions",
    "infrared sauna mobile service",
    "cold therapy for athletes",
    "mobile spa services Los Angeles",
    "recovery equipment rental",
  ],
  local: [
    "cold plunge Los Angeles",
    "infrared sauna Beverly Hills",
    "mobile spa Santa Monica",
    "recovery services West Hollywood",
    "wellness therapy Venice Beach",
    "cold therapy Manhattan Beach",
    "sauna services Malibu",
    "mobile recovery LA County",
  ],
  conditions: [
    "muscle recovery",
    "inflammation reduction",
    "stress relief",
    "improved circulation",
    "detoxification",
    "pain relief",
    "performance enhancement",
    "sleep improvement",
    "immune support",
    "mental clarity",
  ],
  industries: [
    "athlete recovery",
    "fitness recovery",
    "executive wellness",
    "spa services",
    "wellness center",
    "health optimization",
    "biohacking",
    "preventive care",
  ],
};

export const getKeywordsForPage = (pageType: string): string[] => {
  switch (pageType) {
    case "home":
      return [
        ...wellnessKeywords.primary,
        ...wellnessKeywords.secondary.slice(0, 5),
        ...wellnessKeywords.local.slice(0, 3),
      ];
    case "services":
      return [...wellnessKeywords.secondary, ...wellnessKeywords.conditions.slice(0, 5)];
    case "booking":
      return [...wellnessKeywords.longTail.slice(0, 5), ...wellnessKeywords.local];
    case "about":
      return [...wellnessKeywords.industries, ...wellnessKeywords.primary.slice(0, 3)];
    default:
      return wellnessKeywords.primary;
  }
};

export const generateMetaKeywords = (pageType: string): string => {
  return getKeywordsForPage(pageType).join(", ");
};
