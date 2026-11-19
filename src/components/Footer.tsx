import { Link } from 'react-router-dom';
import { publishedBlogs, siteConfig } from '../config';
import SocialIcons from './SocialIcons';

/** apple.com-style footer: small grey type on mist, link columns under headings. */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      heading: 'Résumé',
      links: [
        { label: 'Experience', to: '/about#experience', show: siteConfig.experience.length > 0 },
        { label: 'Projects', to: '/about#projects', show: siteConfig.projects.length > 0 },
        { label: 'Education', to: '/about#education', show: siteConfig.education.length > 0 },
        { label: 'Certifications', to: '/about#certifications', show: siteConfig.certifications.length > 0 },
        { label: 'Publications', to: '/about#publications', show: siteConfig.publications.length > 0 },
        { label: 'Blogs', to: '/about#blogs', show: publishedBlogs.length > 0 },
      ],
    },
    {
      heading: 'Pages',
      links: [
        { label: 'Work', to: '/', show: true },
        { label: 'Résumé', to: '/about', show: true },
        { label: 'Skills', to: '/skills', show: true },
      ],
    },
  ];

  return (
    <footer className="bg-apple-mist px-6 pb-10 text-[12px] leading-[1.33] text-apple-gray">
      <div className="mx-auto max-w-[980px] border-t border-apple-line pt-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:gap-16">
          <div>
            <p className="text-[14px] font-semibold text-apple-ink">{siteConfig.name}</p>
            <p className="mt-1">{siteConfig.title}</p>
            <SocialIcons className="mt-4" />
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-8">
            {columns.map((column) => (
              <div key={column.heading}>
                <p className="mb-2 font-semibold text-apple-ink">{column.heading}</p>
                <ul>
                  {column.links
                    .filter((link) => link.show)
                    .map((link) => (
                      <li key={link.to}>
                        {/* py-1 lifts the 12px line past the 24px tap-target minimum. */}
                        <Link
                          viewTransition
                          to={link.to}
                          className="apple-focus inline-block py-1 text-apple-ink/80 underline-offset-2 hover:text-apple-ink hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="mt-8 border-t border-apple-line pt-4">
          Copyright &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
