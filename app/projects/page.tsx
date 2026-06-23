import { getProjects } from "@/lib/db";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 md:pt-32">
        <section className="section-padding pb-12 md:pb-16 border-b border-white/[0.06]">
          <div className="container-premium">
            <Link
              href="/#home"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <p className="label-studio mb-6">Portfolio</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-semibold text-foreground leading-tight max-w-4xl">
              All <span className="text-brand">projects</span>
            </h1>
            <p className="mt-6 md:mt-8 text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              A complete collection of digital experiences crafted with precision and care.
            </p>
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="container-premium">
            {projects.length === 0 ? (
              <div className="text-center py-20 premium-card">
                <p className="text-muted-foreground text-lg">
                  No projects yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
                {projects.map((project, index) => (
                  <article
                    key={project.id}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                      index % 2 === 1 ? "lg:[direction:rtl]" : ""
                    }`}
                  >
                    <div
                      className={`lg:col-span-7 premium-card overflow-hidden aspect-[16/10] relative ${
                        index % 2 === 1 ? "lg:[direction:ltr]" : ""
                      }`}
                    >
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted min-h-[240px]">
                          <span className="text-6xl font-heading font-semibold text-white/10">
                            {project.title[0]}
                          </span>
                        </div>
                      )}
                      {project.featured && (
                        <span className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 border border-white/20 bg-black/50 text-foreground">
                          Featured
                        </span>
                      )}
                    </div>

                    <div
                      className={`lg:col-span-5 flex flex-col ${
                        index % 2 === 1 ? "lg:[direction:ltr]" : ""
                      }`}
                    >
                      <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-5">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6 text-base md:text-lg">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground border border-white/10 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary rounded-full w-fit"
                      >
                        Visit project
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
