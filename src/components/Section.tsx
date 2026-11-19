import type { ReactNode } from 'react';
import Reveal from './Reveal';

/**
 * One band of the résumé page: a white or mist strip, a large Apple-style
 * heading, then the content. Bands alternate tone the way apple.com does, so
 * sections separate without rules or borders.
 */
export default function Section({
  id,
  title,
  intro,
  tone = 'white',
  children,
}: {
  id: string;
  title: string;
  /** Optional line under the heading, in the secondary grey. */
  intro?: ReactNode;
  tone?: 'white' | 'mist';
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`px-6 py-20 sm:py-24 lg:py-28 ${tone === 'mist' ? 'bg-apple-mist' : 'bg-white'}`}
    >
      <div className="mx-auto max-w-[980px]">
        <Reveal>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[40px] lg:text-[48px]">
            {title}
          </h2>
          {intro && (
            <p className="mt-4 text-[19px] leading-[1.42] tracking-[-0.01em] text-apple-gray sm:text-[21px]">
              {intro}
            </p>
          )}
        </Reveal>
        <Reveal delay={70} className="mt-10 block sm:mt-12">
          {children}
        </Reveal>
      </div>
    </section>
  );
}
