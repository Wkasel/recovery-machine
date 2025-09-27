"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/typography/Typography";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface LandingFAQProps {
  title: string;
  subtitle: string;
  faqs: FAQ[];
  contactCTA?: {
    text: string;
    subtext: string;
  };
}

export const LandingFAQ: FC<LandingFAQProps> = ({
  title,
  subtitle,
  faqs,
  contactCTA = {
    text: "Still have questions?",
    subtext: "Get instant answers from our recovery experts"
  }
}) => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Heading
            as="h2"
            size="display-md"
            weight="bold"
            className="mb-6 tracking-tight"
          >
            {title}
          </Heading>
          <Text
            size="xl"
            color="muted"
            align="center"
            className="max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </Text>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-16">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 py-2 bg-card"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-muted/30 border border-border rounded-lg p-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          
          <Heading
            as="h3"
            size="xl"
            weight="semibold"
            className="mb-4"
          >
            {contactCTA.text}
          </Heading>
          
          <Text
            size="base"
            color="muted"
            align="center"
            className="mb-8 max-w-lg mx-auto"
          >
            {contactCTA.subtext}
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/book" className="flex items-center">
                Book a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted"
            >
              <Link href="tel:+1-555-RECOVERY" className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Call Us Now
              </Link>
            </Button>
          </div>
          
          <Text
            size="sm"
            color="muted"
            align="center"
            className="mt-4"
          >
            Free consultation • No obligation • Same-day booking available
          </Text>
        </div>
      </div>
    </section>
  );
};