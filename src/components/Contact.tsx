import { publishedBlogs, siteConfig } from '../config';
import Section from './Section';

/** Closing band: the email address as readable text, not only an icon. */
export default function Contact() {
  const { email, calendar } = siteConfig.social;
  if (!email && !calendar) return null;

  return (
    <Section
      id="contact"
      title="Get in touch"
      intro="Email is the fastest way to reach me."
      // Keep the bands alternating: Blogs (mist) sits above this only when it has posts.
      tone={publishedBlogs.length > 0 ? 'white' : 'mist'}
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-baseline sm:gap-10">
        {email && (
          <a href={`mailto:${email}`} className="apple-link break-all text-[21px] sm:text-[24px]">
            {email}
          </a>
        )}
        {calendar && (
          <a href={calendar} target="_blank" rel="noopener noreferrer" className="apple-link text-[17px]">
            Schedule a coffee chat <span aria-hidden="true">›</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </Section>
  );
}
