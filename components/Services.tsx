import { getServices } from "@/lib/data";
import ServicesCarousel from "@/components/ServicesCarousel";

/** Loads the services on the server, so the section is part of the HTML (no empty flash). */
export default async function Services() {
  const services = await getServices();
  if (!services.length) return null;
  return <ServicesCarousel services={services} />;
}
