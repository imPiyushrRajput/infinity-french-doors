import type { Metadata } from "next";
import ContactBlock from "@/components/ContactBlock";
import { PageHeader } from "@/components/Shared";
import { business } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Infinity French Doors in Nashik and Jalgaon for enquiries, quotes and site visits.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Visit a plant, call us, or send an enquiry and we will get back to you."
        crumbs={[{ label: "Contact Us" }]}
      />
      <ContactBlock />
      <section className="border-t border-navy-950/5">
        <iframe
          src={business.mapEmbed}
          title="Infinity French Doors on Google Maps"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[420px] w-full grayscale-[30%] lg:h-[520px]"
        />
      </section>
    </>
  );
}
