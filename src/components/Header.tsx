import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { useNavPanel } from '../useNavPanel';
import { useActiveSection } from '../useActiveSection';

/**
 * Sections of this page only, so the active rule always points at what is being
 * read. Five at most: Blogs and Contact stay out of the bar and are tracked only
 * so the rule can hide while the reader is in them.
 */
const sections = [
  { id: 'experience', label: 'Experience', show: siteConfig.experience.length > 0 },
  { id: 'projects', label: 'Projects', show: siteConfig.projects.length > 0 },
  { id: 'education', label: 'Education', show: siteConfig.education.length > 0 },
  { id: 'certifications', label: 'Certifications', show: siteConfig.certifications.length > 0 },
  { id: 'publications', label: 'Publications', show: siteConfig.publications.length > 0 },
].filter((section) => section.show);
const trackedIds = [...sections.map((section) => section.id), 'blogs', 'contact'];

/** Other pages. The "›" marks them as leaving this one, never a jump within it. */
const pages = [
  { label: 'Work', to: '/' },
  { label: 'Skills', to: '/skills' },
];

const sheetLink =
  'apple-focus block py-1.5 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-apple-ink transition-opacity duration-150 active:opacity-50';

/** Apple-style global nav: a thin, always-frosted bar the page scrolls under. */
export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  // Matches the `lg:` swap between the inline nav and the mobile sheet below.
  const { open, setOpen, close, triggerRef, panelRef } = useNavPanel(headerRef, '(min-width: 1024px)');

  // Every nav item is now a section of this page, so no special cases: the rule
  // simply hides when the current section (Blogs, Contact) has no nav item.
  const activeId = useActiveSection(trackedIds);

  // Where the rule sits. Held at its last position while hidden so it never
  // animates in from the left; `move` is false whenever it was invisible before.
  const [rule, setRule] = useState<{ x: number; w: number; move: boolean } | null>(null);
  const wasVisible = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const link = activeId
        ? nav.querySelector<HTMLElement>(`[data-nav="${activeId}"]`)
        : null;
      if (link) setRule({ x: link.offsetLeft, w: link.offsetWidth, move: wasVisible.current });
      wasVisible.current = link !== null;
    };

    measure();
    // Catches viewport changes and the reflow when the webfont swaps in.
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(nav);
    return () => resizeObserver.disconnect();
  }, [activeId]);

  return (
    <header
      ref={headerRef}
      // No glass while the sheet is open: backdrop-filter makes the header the
      // containing block for fixed children, which would trap the full-screen
      // sheet inside this 48px bar.
      className={`fixed inset-x-0 top-0 z-50 border-b border-black/[0.08] ${open ? 'bg-white' : 'apple-glass'}`}
    >
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between px-6">
        <Link
          viewTransition
          to="/about"
          className="apple-focus flex items-center gap-2.5 text-[14px] font-semibold tracking-[-0.01em]"
        >
          <img
            src={siteConfig.avatar}
            alt=""
            width={28}
            height={28}
            decoding="async"
            className="h-7 w-7 rounded-full object-cover"
          />
          {siteConfig.name.split(' ')[0]}
        </Link>

        {/* Shown from lg: at 12px the links need ~600px, which fits from 1024. */}
        <nav className="relative hidden items-center gap-7 lg:flex" aria-label="Primary" ref={navRef}>
          {sections.map((section) => (
            <Link
              key={section.id}
              viewTransition
              to={`/about#${section.id}`}
              data-nav={section.id}
              aria-current={activeId === section.id ? 'location' : undefined}
              className={`apple-focus text-[12px] leading-4 tracking-[-0.01em] transition-colors duration-200 ${
                activeId === section.id ? 'text-apple-ink' : 'text-apple-ink/70 hover:text-apple-ink'
              }`}
            >
              {section.label}
            </Link>
          ))}

          <span aria-hidden="true" className="h-3.5 w-px bg-apple-line" />
          {pages.map((page) => (
            <Link
              key={page.to}
              viewTransition
              to={page.to}
              className="apple-focus text-[12px] leading-4 tracking-[-0.01em] text-apple-ink/70 transition-colors duration-200 hover:text-apple-ink"
            >
              {page.label} <span aria-hidden="true">›</span>
            </Link>
          ))}

          {/* Decorative — `aria-current` on the link above is what carries the
              state to assistive tech. Sits on the bar's bottom edge, like a tab. */}
          <span
            aria-hidden="true"
            data-move={rule?.move ? 'true' : 'false'}
            className="nav-rule pointer-events-none absolute -bottom-4 left-0 h-0.5 w-px origin-left bg-apple-ink"
            style={{
              transform: `translateX(${rule?.x ?? 0}px) scaleX(${rule?.w ?? 0})`,
              opacity: activeId && rule ? 1 : 0,
            }}
          />
        </nav>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label="Open navigation"
          className="apple-focus -mr-2 p-2 transition-transform duration-100 ease-out active:scale-[0.94] lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M3 9h18" />
            <path d="M3 15h18" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="site-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="nav-overlay fixed inset-0 z-50 flex flex-col bg-white/95 px-6 pb-10 backdrop-blur-xl lg:hidden"
        >
          <div className="flex h-12 shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={close}
              aria-label="Close navigation"
              className="apple-focus -mr-2 p-2 transition-transform duration-100 ease-out active:scale-[0.94]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Sections" className="min-h-0 flex-1 overflow-y-auto pt-4">
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link viewTransition to={`/about#${section.id}`} onClick={close} className={sheetLink}>
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-apple-line pt-6 text-[17px]">
            {pages.map((page) => (
              <Link key={page.to} viewTransition to={page.to} onClick={close} className="apple-link block w-fit">
                {page.label} <span aria-hidden="true">›</span>
              </Link>
            ))}
            {siteConfig.social.email && (
              <a href={`mailto:${siteConfig.social.email}`} onClick={close} className="apple-link block w-fit">
                Email me <span aria-hidden="true">›</span>
              </a>
            )}
            <a
              href={siteConfig.social.calendar}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="apple-link block w-fit"
            >
              Schedule a coffee chat <span aria-hidden="true">›</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
