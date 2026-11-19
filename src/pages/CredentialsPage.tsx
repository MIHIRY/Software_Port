import { useEffect, type ReactNode } from 'react';
import { siteConfig } from '../config';
import ProjectsNav from '../components/ProjectsNav';
import { ArrowOut } from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import { useDocumentMeta } from '../useDocumentMeta';

const card = 'h-full rounded-3xl p-6 sm:p-7 lg:p-8';
const cardTitle = 'text-lg font-bold leading-snug text-ink lg:text-xl';

/** One block of the page: a label in the gutter, then its grid of cards. */
function Block({ id, title, grid, children }: { id: string; title: string; grid: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-8 sm:mt-10">
      <h2
        id={`${id}-title`}
        className="px-1 pb-3 text-sm font-bold uppercase tracking-[0.14em] text-ink lg:text-base"
      >
        {title}
      </h2>
      <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${grid}`}>{children}</div>
    </section>
  );
}

/**
 * Everything the résumé page used to carry beyond the projects: jobs, degrees,
 * certificates and papers. Same light set as /work, which links here from its
 * Certifications card (#certifications).
 */
export default function CredentialsPage() {
  useDocumentMeta(siteConfig.pageMeta.credentials);

  // Same as /work: the tint has to reach the overscroll area too.
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#EEF5FB';
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-page p-3 pb-10 sm:p-4 sm:pb-14 lg:p-5 lg:pb-16">
      <div className="mx-auto max-w-[1500px]">
        <ProjectsNav />

        <Reveal className="mt-3 block lg:mt-4">
          <section className="flex min-h-[220px] items-center justify-center rounded-3xl bg-surface px-7 py-14 sm:min-h-[280px] sm:px-9 lg:min-h-[320px] lg:px-10">
            <h1 className="max-w-3xl text-center text-[34px] leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              <span className="font-bold">Experience</span>{' '}
              <span className="font-light italic">and credentials</span>
            </h1>
          </section>
        </Reveal>

        <Block id="experience" title="Experience" grid="lg:grid-cols-2">
          {siteConfig.experience.map((job, i) => (
            <Reveal key={job.company} delay={(i % 2) * 70}>
              <article className={`${card} bg-surface`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div>
                    {job.focus && (
                      <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted lg:text-xs">
                        {job.focus}
                      </p>
                    )}
                    <h3 className={cardTitle}>{job.title}</h3>
                    <p className="mt-1 text-[15px] text-ink lg:text-base">{job.company}</p>
                  </div>
                  <p className="shrink-0 text-xs text-ink-muted sm:pt-1 lg:text-[13px]">{job.dateRange}</p>
                </div>
                <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-[13px] leading-relaxed text-ink lg:text-sm">
                      <span aria-hidden="true" className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </Block>

        <Block id="education" title="Education" grid="md:grid-cols-2">
          {siteConfig.education.map((entry, i) => (
            <Reveal key={entry.school} delay={(i % 2) * 70}>
              <article className={`${card} bg-surface`}>
                <p className="text-xs text-ink-muted lg:text-[13px]">{entry.dateRange}</p>
                <h3 className={`mt-2 ${cardTitle}`}>{entry.degree}</h3>
                <p className="mt-1 text-[15px] text-ink lg:text-base">{entry.school}</p>
                <ul className="mt-6 space-y-2 border-t border-hairline pt-5 text-[13px] leading-relaxed text-ink lg:text-sm">
                  {entry.achievements.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </Block>

        <Block id="certifications" title="Certifications" grid="md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={(i % 3) * 70}>
              <article className={`${card} flex flex-col bg-accent`}>
                <h3 className="text-base font-bold leading-snug text-ink lg:text-lg">{cert.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink lg:text-sm">{cert.description}</p>
                {/* mt-auto pins the issuer row to the bottom, so a row of cards closes on one line. */}
                <div className="mt-auto pt-6">
                  <div className="flex items-end justify-between gap-4 border-t border-accent-deep pt-4">
                    <p className="text-xs leading-snug text-ink lg:text-[13px]">
                      {cert.issuer}
                      {cert.date && ` · ${cert.date}`}
                    </p>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Verify ${cert.title} (opens in a new tab)`}
                        className="whitespace-nowrap rounded-sm py-1.5 text-[11px] uppercase tracking-[0.12em] text-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
                      >
                        [Verify]
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </Block>

        <Block id="publications" title="Publications" grid="md:grid-cols-2">
          {siteConfig.publications.map((paper, i) => (
            <Reveal key={paper.title} delay={(i % 2) * 70}>
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group ${card} flex flex-col justify-between bg-surface transition-[background-color,transform] duration-200 hover:bg-surface-deep active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold leading-snug text-ink lg:text-lg">{paper.title}</h3>
                  <ArrowOut className="mt-0.5 shrink-0 text-ink" />
                </div>
                <p className="mt-6 text-[13px] leading-relaxed text-ink-muted lg:text-sm">{paper.venue}</p>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </Block>
      </div>
    </div>
  );
}
