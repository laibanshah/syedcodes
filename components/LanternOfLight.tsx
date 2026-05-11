"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LanternContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface LanternOfLightProps {
  content?: LanternContent;
}

export default function LanternOfLight({ content }: LanternOfLightProps) {
  const data = content || {
    title: "Lantern of Light",
    subtitle: "Spiritual & Islamic Community",
    description: "A spiritual and Islamic community presentation focused on guiding hearts, sharing wisdom, and fostering a supportive environment built on faith and unity.",
    image: "/assets/lol.png"
  };

  return (
    <section className="py-32 relative bg-background border-y border-border overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full p-4 border border-primary/20 bg-card/30 backdrop-blur-sm shadow-2xl">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-card flex items-center justify-center">
                 <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-contain p-8 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                 />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-heading text-foreground mb-6">{data.title}</h2>
            <div className="w-16 h-1 bg-primary mb-6 rounded-full mx-auto md:mx-0" />
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {data.description}
            </p>
            
            <a
              href="https://whatsapp.com/channel/0029VaeYmbP5PO0zmfC6Yl2J"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 px-8 py-4 rounded-full font-medium transition-all hover:bg-[#25D366] hover:text-white group"
            >
              Join Our WhatsApp Community
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
