import { siteConfig } from '../config';
import Section from './Section';

export default function Experience() {
  if (siteConfig.experience.length === 0) return null;

  return (
    <Section id="experience" title="Experience">
      <div className="space-y-4">
        {siteConfig.experience.map((exp) => (
          <article key={exp.company} className="rounded-[28px] bg-apple-mist p-7 sm:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <div>
                {exp.focus && (
                  <p className="mb-1 text-[14px] font-semibold text-apple-orange">{exp.focus}</p>
                )}
                <h3 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.015em] sm:text-[28px]">
                  {exp.title}
                </h3>
                {/* Ink, not grey: recruiters scan for company names. */}
                <p className="mt-1.5 text-[17px] text-apple-ink">{exp.company}</p>
              </div>
              <p className="shrink-0 text-[14px] text-apple-gray sm:pt-1">{exp.dateRange}</p>
            </div>
            {/* 65ch keeps a line near 75 characters; full card width ran ~106. */}
            <ul className="mt-6 max-w-[65ch] space-y-3">
              {exp.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-[17px] leading-[1.47] tracking-[-0.01em]">
                  <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-apple-gray" />
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
