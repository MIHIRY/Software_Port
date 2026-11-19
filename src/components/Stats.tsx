import { siteConfig } from '../config';
import Reveal from './Reveal';

/**
 * apple.com-style stat row under the hero: three figures only this résumé could
 * show. It continues the hero's white band, set off by a hairline, so it reads
 * as the hero's evidence rather than a new section.
 */
export default function Stats() {
  if (siteConfig.stats.length === 0) return null;

  return (
    <section aria-label="Highlights" className="bg-white px-6 pb-20 sm:pb-24">
      <Reveal className="mx-auto block max-w-[980px] border-t border-apple-line pt-12 sm:pt-14">
        <ul className="grid gap-10 text-center sm:grid-cols-3 sm:gap-8">
          {siteConfig.stats.map((stat) => (
            <li key={stat.value}>
              <p className="text-[48px] font-semibold leading-none tracking-[-0.03em] sm:text-[44px] lg:text-[56px]">
                {stat.value}
              </p>
              <p className="mx-auto mt-3 max-w-[16rem] text-[17px] leading-[1.4] tracking-[-0.01em] text-apple-gray">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
