import { getProjects } from "@/lib/db";
import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              All <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A complete collection of digital experiences crafted with precision and care
            </p>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No projects yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-12">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`flex flex-col md:flex-row gap-8 items-center bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-border/30 rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 ${
                      index % 2 === 0 ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Project Image */}
                    <div className="w-full md:w-1/2">
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-purple-500/10 aspect-video">
                        {project.image_url ? (
                          <Image
                            src={project.image_url}
                            alt={project.title}
                            width={800}
                            height={600}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl font-bold text-primary/30">{project.title[0]}</span>
                          </div>
                        )}
                        {project.featured && (
                          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                            Featured
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {project.description}
                      </p>
                      
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-border/50 rounded-full text-sm font-medium text-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Visit Button */}
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 w-fit"
                      >
                        Visit Project <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
