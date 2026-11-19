import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import Section from './Section';

export default function About() {
  // Apple's copy-block style: the opening sentence in ink, the rest in grey.
  const text = siteConfig.aboutMe;
  const cut = text.indexOf('. ') + 1;
  const lead = cut > 0 ? text.slice(0, cut) : text;
  const rest = cut > 0 ? text.slice(cut) : '';

  return (
    <Section id="about" title="About me" tone="mist">
      <p className="text-[21px] font-semibold leading-[1.38] tracking-[-0.012em] text-apple-gray sm:text-[24px] lg:text-[28px] lg:leading-[1.32]">
        <span className="text-apple-ink">{lead}</span>
        {rest}
      </p>

      {/* A short toolkit in the About text's own three parts, as plain text: a
          wall of pills read as tappable, and the full set is on /skills. */}
      <dl className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
        {siteConfig.skills.map(({ group, items }) => (
          <div key={group}>
            <dt className="text-[14px] font-semibold text-apple-ink">{group}</dt>
            <dd className="mt-2 text-[17px] leading-[1.47] tracking-[-0.01em] text-apple-gray">
              {items.join(' · ')}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-[17px]">
        <Link viewTransition to="/skills" className="apple-link">
          Full toolkit <span aria-hidden="true">›</span>
        </Link>
      </p>
    </Section>
  );
}
