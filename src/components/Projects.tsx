import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import Section from './Section';

/** How many of `siteConfig.projects` the résumé features; config order decides which. */
const FEATURED = 6;

export default function Projects() {
  if (siteConfig.projects.length === 0) return null;
  const featured = siteConfig.projects.slice(0, FEATURED);

  return (
    <Section id="projects" title="Projects" tone="mist">
      <ul className="grid gap-4 md:grid-cols-2">
        {featured.map((project) => (
          <li key={project.name}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              // A short name for link lists; the card's full text stays readable in place.
              aria-label={`${project.name}, on GitHub (opens in a new tab)`}
              className="apple-focus group flex h-full flex-col rounded-[28px] bg-white p-7 transition-transform duration-150 ease-out active:scale-[0.98] sm:p-8"
            >
              <h3 className="text-[21px] font-semibold leading-[1.2] tracking-[-0.012em]">{project.name}</h3>
              {/* Not clamped: the end of each description is where the result is. */}
              <p className="mt-3 text-[17px] leading-[1.47] tracking-[-0.01em] text-apple-gray">
                {project.description}
              </p>
              <p className="mt-4 text-[14px] leading-[1.4] text-apple-gray">{project.skills.join(' · ')}</p>
              <span className="mt-auto pt-6 text-[17px] text-apple-link underline-offset-4 group-hover:underline">
                View on GitHub <span aria-hidden="true">›</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-[17px]">
        {/* "More", not "All": the projects page features nine, not every repo. */}
        <Link viewTransition to="/" className="apple-link">
          More projects <span aria-hidden="true">›</span>
        </Link>
      </p>
    </Section>
  );
}
