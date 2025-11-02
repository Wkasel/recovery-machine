import { Metadata } from "next";
import Link from "next/link";
import { Snowflake, Flame, MapPin, Clock, Phone, Star } from "lucide-react";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/v2-design/layout/PageWrapper";

interface CityData {
  name: string;
  slug: string;
  county: string;
  description: string;
  population?: string;
  highlights: string[];
  nearbyAreas: string[];
}

const cities: CityData[] = [
  // LA County Cities
  {
    name: "Beverly Hills",
    slug: "beverly-hills",
    county: "Los Angeles",
    description: "Luxury mobile recovery services delivered to Beverly Hills homes, hotels, and estates. Professional cold plunge and infrared sauna therapy for the Westside's most exclusive community.",
    population: "32,000",
    highlights: [
      "Same-day service to Beverly Hills residences",
      "Discreet, professional wellness delivery",
      "Serving Rodeo Drive, Golden Triangle, and surrounding areas",
      "Preferred provider for luxury hotels and estates"
    ],
    nearbyAreas: ["West Hollywood", "Bel Air", "Holmby Hills", "Century City"]
  },
  {
    name: "Santa Monica",
    slug: "santa-monica",
    county: "Los Angeles",
    description: "Mobile recovery services for Santa Monica's active beachside community. Cold plunge and infrared sauna delivered to your home, perfect for athletes, surfers, and wellness enthusiasts.",
    population: "93,000",
    highlights: [
      "Beach-community focused recovery programs",
      "Service to Ocean Park, Montana Avenue, and Palisades Park areas",
      "Popular with athletes training on the beach and Santa Monica stairs",
      "Flexible scheduling for busy professionals"
    ],
    nearbyAreas: ["Venice", "Pacific Palisades", "Brentwood", "Marina del Rey"]
  },
  {
    name: "Manhattan Beach",
    slug: "manhattan-beach",
    county: "Los Angeles",
    description: "Premium mobile recovery for Manhattan Beach's fitness-focused community. Professional cold plunge and sauna therapy delivered to South Bay's most active neighborhood.",
    population: "35,000",
    highlights: [
      "Specialized athletic recovery for volleyball and beach sports",
      "Service to the Strand, Sand Section, and Hill Section",
      "Popular with professional athletes and fitness enthusiasts",
      "Same-day availability for South Bay residents"
    ],
    nearbyAreas: ["Hermosa Beach", "Redondo Beach", "El Segundo", "Torrance"]
  },
  {
    name: "Venice",
    slug: "venice",
    county: "Los Angeles",
    description: "Mobile wellness services for Venice's vibrant fitness and wellness community. Cold plunge and infrared sauna delivered to Venice Beach, Abbot Kinney, and surrounding neighborhoods.",
    population: "41,000",
    highlights: [
      "Serving Venice Beach, Muscle Beach, and boardwalk communities",
      "Popular with bodybuilders, athletes, and wellness practitioners",
      "Service to Venice Canals and Abbot Kinney",
      "Flexible scheduling for creative professionals"
    ],
    nearbyAreas: ["Santa Monica", "Mar Vista", "Marina del Rey", "Playa del Rey"]
  },
  {
    name: "Malibu",
    slug: "malibu",
    county: "Los Angeles",
    description: "Luxury mobile recovery services for Malibu's coastal estates and beachfront properties. Professional cold plunge and infrared sauna therapy delivered throughout the Malibu coast.",
    population: "12,000",
    highlights: [
      "Service to all Malibu neighborhoods from Point Dume to Zuma Beach",
      "Discreet delivery to private estates and beachfront homes",
      "Popular with entertainers, athletes, and executives",
      "Extended service hours for coastal properties"
    ],
    nearbyAreas: ["Pacific Palisades", "Topanga", "Calabasas", "Thousand Oaks"]
  },
  {
    name: "Culver City",
    slug: "culver-city",
    county: "Los Angeles",
    description: "Mobile recovery services for Culver City's growing tech and entertainment community. Cold plunge and infrared sauna delivered to homes and offices throughout Culver City.",
    population: "39,000",
    highlights: [
      "Corporate wellness programs for tech companies",
      "Service to Downtown Culver City and surrounding areas",
      "Popular with entertainment industry professionals",
      "Same-day availability for Westside locations"
    ],
    nearbyAreas: ["Mar Vista", "Palms", "West LA", "Marina del Rey"]
  },
  {
    name: "Pasadena",
    slug: "pasadena",
    county: "Los Angeles",
    description: "Professional mobile recovery services for Pasadena and the San Gabriel Valley. Cold plunge and infrared sauna therapy delivered to homes throughout Pasadena's historic neighborhoods.",
    population: "138,000",
    highlights: [
      "Service to Old Pasadena, South Lake, and all Pasadena districts",
      "Extended coverage to San Marino and South Pasadena",
      "Popular with JPL scientists, Caltech community, and professionals",
      "Flexible scheduling for San Gabriel Valley residents"
    ],
    nearbyAreas: ["Altadena", "San Marino", "South Pasadena", "Glendale"]
  },
  {
    name: "Long Beach",
    slug: "long-beach",
    county: "Los Angeles",
    description: "Mobile wellness services for Long Beach's diverse coastal community. Professional cold plunge and infrared sauna delivered throughout Long Beach, from Belmont Shore to Naples.",
    population: "466,000",
    highlights: [
      "Service to Belmont Shore, Naples, and all Long Beach neighborhoods",
      "Popular with military personnel, port workers, and beach athletes",
      "Extended service area throughout South Bay",
      "Flexible scheduling for Long Beach residents"
    ],
    nearbyAreas: ["Signal Hill", "Seal Beach", "Lakewood", "Carson"]
  },

  // Orange County Cities
  {
    name: "Irvine",
    slug: "irvine",
    county: "Orange",
    description: "Premium mobile recovery services for Irvine's thriving business and residential communities. Cold plunge and infrared sauna therapy delivered throughout Orange County's largest city.",
    population: "307,000",
    highlights: [
      "Corporate wellness programs for Irvine's tech corridor",
      "Service to all Irvine villages and business districts",
      "Popular with UCI students, athletes, and professionals",
      "Same-day availability throughout Orange County"
    ],
    nearbyAreas: ["Newport Beach", "Costa Mesa", "Tustin", "Lake Forest"]
  },
  {
    name: "Newport Beach",
    slug: "newport-beach",
    county: "Orange",
    description: "Luxury mobile recovery for Newport Beach's coastal estates and harbor communities. Professional cold plunge and infrared sauna delivered from Balboa Island to Corona del Mar.",
    population: "85,000",
    highlights: [
      "Service to Balboa Peninsula, Balboa Island, and Corona del Mar",
      "Discreet delivery to waterfront estates and yacht clubs",
      "Popular with boaters, surfers, and coastal athletes",
      "Extended hours for Newport Harbor communities"
    ],
    nearbyAreas: ["Costa Mesa", "Irvine", "Laguna Beach", "Huntington Beach"]
  },
  {
    name: "Huntington Beach",
    slug: "huntington-beach",
    county: "Orange",
    description: "Mobile recovery services for Huntington Beach's legendary surf community. Cold plunge and infrared sauna therapy delivered to Surf City USA's most active neighborhoods.",
    population: "198,000",
    highlights: [
      "Specialized recovery for surfers and beach athletes",
      "Service to downtown HB, Pier area, and all coastal neighborhoods",
      "Popular with professional surfers and beach volleyball players",
      "Extended service throughout North Orange County"
    ],
    nearbyAreas: ["Fountain Valley", "Costa Mesa", "Westminster", "Seal Beach"]
  },
  {
    name: "Costa Mesa",
    slug: "costa-mesa",
    county: "Orange",
    description: "Professional mobile recovery for Costa Mesa's vibrant arts and business district. Cold plunge and infrared sauna delivered throughout Costa Mesa and surrounding communities.",
    population: "113,000",
    highlights: [
      "Service to South Coast Plaza area and all Costa Mesa districts",
      "Corporate wellness for Orange County businesses",
      "Popular with retail professionals and creative community",
      "Central location serving all of Orange County"
    ],
    nearbyAreas: ["Newport Beach", "Irvine", "Huntington Beach", "Santa Ana"]
  },
  {
    name: "Laguna Beach",
    slug: "laguna-beach",
    county: "Orange",
    description: "Luxury mobile recovery for Laguna Beach's artistic coastal community. Professional cold plunge and infrared sauna therapy delivered to hillside estates and beachfront properties.",
    population: "23,000",
    highlights: [
      "Service to all Laguna Beach neighborhoods and coves",
      "Discreet delivery to hillside estates and beach homes",
      "Popular with artists, surfers, and wellness practitioners",
      "Flexible scheduling for coastal properties"
    ],
    nearbyAreas: ["Laguna Niguel", "Aliso Viejo", "Dana Point", "Newport Beach"]
  },
  {
    name: "Anaheim",
    slug: "anaheim",
    county: "Orange",
    description: "Mobile wellness services for Anaheim's diverse residential and hospitality community. Cold plunge and infrared sauna delivered throughout Anaheim Hills and surrounding areas.",
    population: "346,000",
    highlights: [
      "Service to Anaheim Hills and all Anaheim districts",
      "Corporate wellness for major employers and hotels",
      "Extended coverage throughout North Orange County",
      "Flexible scheduling for residents and visitors"
    ],
    nearbyAreas: ["Orange", "Fullerton", "Placentia", "Yorba Linda"]
  },
  {
    name: "Mission Viejo",
    slug: "mission-viejo",
    county: "Orange",
    description: "Premium mobile recovery for Mission Viejo's master-planned communities. Professional cold plunge and infrared sauna therapy delivered throughout South Orange County.",
    population: "94,000",
    highlights: [
      "Service to all Mission Viejo villages and neighborhoods",
      "Popular with families and active lifestyle communities",
      "Extended coverage throughout South Orange County",
      "Flexible scheduling for planned communities"
    ],
    nearbyAreas: ["Lake Forest", "Laguna Niguel", "Rancho Santa Margarita", "San Juan Capistrano"]
  },
  {
    name: "Dana Point",
    slug: "dana-point",
    county: "Orange",
    description: "Mobile recovery services for Dana Point's coastal harbor community. Cold plunge and infrared sauna delivered from Dana Point Harbor to Salt Creek Beach.",
    population: "33,000",
    highlights: [
      "Service to Dana Point Harbor and all coastal neighborhoods",
      "Popular with boaters, surfers, and harbor community",
      "Specialized recovery for ocean athletes",
      "Extended hours for coastal properties"
    ],
    nearbyAreas: ["San Clemente", "Laguna Niguel", "San Juan Capistrano", "Laguna Beach"]
  }
];

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityData = cities.find((c) => c.slug === params.city);

  if (!cityData) {
    return {
      title: "Location Not Found | The Recovery Machine",
    };
  }

  return {
    title: `Mobile Recovery ${cityData.name} | Cold Plunge & Infrared Sauna ${cityData.county} County`,
    description: `${cityData.description} Book your mobile wellness session in ${cityData.name} today.`,
    keywords: `mobile recovery ${cityData.name}, cold plunge ${cityData.name}, infrared sauna ${cityData.name}, ${cityData.county} County wellness, mobile wellness ${cityData.name}`,
    openGraph: {
      title: `Mobile Recovery Services in ${cityData.name}, ${cityData.county} County`,
      description: cityData.description,
      type: "website",
      url: `https://therecoverymachine.com/locations/${cityData.slug}`,
    },
    alternates: {
      canonical: `https://therecoverymachine.com/locations/${cityData.slug}`,
    },
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const cityData = cities.find((c) => c.slug === params.city);

  if (!cityData) {
    notFound();
  }

  return (
    <PageWrapper maxWidth="7xl">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-mint-accent/20 text-charcoal px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MapPin className="h-4 w-4" />
            {cityData.county} County
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">
            MOBILE RECOVERY
            <span className="block text-charcoal/80 mt-2">{cityData.name.toUpperCase()}</span>
          </h1>
          <p className="text-lg md:text-xl text-charcoal/80 max-w-3xl mx-auto mb-8">
            {cityData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in">
            <Link
              href="/book"
              className="bg-charcoal text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              BOOK NOW IN {cityData.name.toUpperCase()}
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-charcoal text-charcoal text-sm font-medium px-8 py-3 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              GET A QUOTE
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 stagger-children">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Star className="h-4 w-4 text-charcoal" />
              <span className="font-medium">Same-Day Service</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Clock className="h-4 w-4 text-charcoal" />
              <span className="font-medium">Flexible Hours</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Phone className="h-4 w-4 text-charcoal" />
              <span className="font-medium">Licensed & Insured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Highlights */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-medium text-center mb-12">
          SERVING {cityData.name.toUpperCase()}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {cityData.highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <p className="text-charcoal/80">{highlight}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white/30 -mx-4 px-4 mb-16">
        <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-medium text-center mb-4">
          OUR SERVICES IN {cityData.name.toUpperCase()}
        </h2>
        <p className="text-center text-charcoal/70 mb-12 max-w-2xl mx-auto">
          Professional mobile wellness delivered to your {cityData.name} location
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-mint-accent/20 rounded-2xl">
                <Snowflake className="h-6 w-6 text-charcoal" />
              </div>
              <h3 className="text-xl font-medium">Cold Plunge Therapy</h3>
            </div>
            <p className="text-charcoal/80 mb-4">
              Professional cold water immersion (38-55°F) delivered to your {cityData.name} location. Perfect for recovery and wellness.
            </p>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-mint-accent rounded-full" />
                Precision temperature control
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-mint-accent rounded-full" />
                Medical-grade filtration
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-mint-accent rounded-full" />
                Professional supervision
              </li>
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-mint-accent/20 rounded-2xl">
                <Flame className="h-6 w-6 text-charcoal" />
              </div>
              <h3 className="text-xl font-medium">Infrared Sauna</h3>
            </div>
            <p className="text-charcoal/80 mb-4">
              Full-spectrum infrared sauna (2-4 person capacity) with luxury amenities. Complete wellness experience at your {cityData.name} home.
            </p>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-mint-accent rounded-full" />
                Full-spectrum infrared heat
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-mint-accent rounded-full" />
                Spacious 2-4 person capacity
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-mint-accent rounded-full" />
                Premium amenities included
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-block text-charcoal hover:text-mint-accent transition-colors font-medium"
          >
            VIEW ALL SERVICES →
          </Link>
        </div>
        </div>
      </section>

      {/* Nearby Areas */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-medium text-center mb-8">
            WE ALSO SERVE NEARBY
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {cityData.nearbyAreas.map((area) => {
              const nearbyCity = cities.find((c) => c.name === area);
              if (nearbyCity) {
                return (
                  <Link
                    key={area}
                    href={`/locations/${nearbyCity.slug}`}
                    className="px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 border border-charcoal/10"
                  >
                    {area}
                  </Link>
                );
              }
              return (
                <span
                  key={area}
                  className="px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full text-charcoal/60 border border-charcoal/10"
                >
                  {area}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal text-white -mx-4 px-4 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">
            READY TO EXPERIENCE RECOVERY IN {cityData.name.toUpperCase()}?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Book your mobile wellness session today and experience professional recovery services delivered directly to your {cityData.name} location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-block bg-mint-accent text-charcoal text-sm font-medium px-10 py-4 rounded-full hover:bg-mint-accent/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              BOOK NOW
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-transparent border-2 border-mint-accent text-mint-accent text-sm font-medium px-10 py-4 rounded-full hover:bg-mint-accent hover:text-charcoal transition-all duration-300"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
