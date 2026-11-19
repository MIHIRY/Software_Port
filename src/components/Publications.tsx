import { siteConfig } from '../config';
import Section from './Section';

export default function Publications() {
  if (siteConfig.publications.length === 0) return null;

  return (
    <Section id="publications" title="Publications">
      <ul className="divide-y divide-apple-line border-y border-apple-line">
        {siteConfig.publications.map((pub) => (
          <li key={pub.link}>
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-focus group flex flex-col gap-3 py-6 transition-opacity duration-150 active:opacity-60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
            >
              <div>
                <h3 className="text-[19px] font-semibold leading-[1.25] tracking-[-0.01em]">{pub.title}</h3>
                <p className="mt-1 text-[17px] leading-[1.47] tracking-[-0.01em] text-apple-gray">
                  {pub.venue}
                </p>
              </div>
              <span className="shrink-0 text-[17px] text-apple-link underline-offset-4 group-hover:underline">
                Read <span aria-hidden="true">›</span>
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
