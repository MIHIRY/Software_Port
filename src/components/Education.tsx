import { siteConfig } from '../config';
import Section from './Section';

export default function Education() {
  if (siteConfig.education.length === 0) return null;

  return (
    <Section id="education" title="Education">
      <div className="grid gap-4 md:grid-cols-2">
        {siteConfig.education.map((edu) => (
          <article key={edu.school} className="rounded-[28px] bg-apple-mist p-7 sm:p-10">
            <p className="text-[14px] text-apple-gray">{edu.dateRange}</p>
            <h3 className="mt-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.015em]">{edu.degree}</h3>
            <p className="mt-2 text-[17px] leading-[1.4] text-apple-gray">{edu.school}</p>
            <ul className="mt-6 space-y-2 text-[17px] leading-[1.47] tracking-[-0.01em]">
              {edu.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
