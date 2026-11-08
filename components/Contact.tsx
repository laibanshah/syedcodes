import { getContactLinks } from "@/lib/data";
import ContactSection from "@/components/ContactSection";

/** Loads the contact links on the server, so the section is part of the HTML (no empty flash). */
export default async function Contact() {
  const contactLinks = await getContactLinks();
  return <ContactSection contactLinks={contactLinks} />;
}
