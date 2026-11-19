import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import ProjectsNav from '../components/ProjectsNav';
import { useDocumentMeta } from '../useDocumentMeta';

const linkClass =
  'rounded-sm text-sm font-bold uppercase tracking-[0.14em] text-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-surface';

export default function NotFound() {
  useDocumentMeta(siteConfig.pageMeta.notFound);

  // Same as /work: the tint has to reach the overscroll area too.
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#EEF5FB';
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-page p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1500px]">
        <ProjectsNav />
        <main className="mt-3 flex min-h-[60vh] flex-col justify-center rounded-3xl bg-surface p-7 sm:p-9 lg:mt-4 lg:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">404</p>
          <h1 className="mt-4 text-[34px] leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            <span className="font-bold">This page</span>{' '}
            <span className="font-light italic">doesn’t exist.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted lg:text-base">
            The link may be out of date, or the address mistyped. Everything else is still where you
            left it.
          </p>
          {/* Two ways out that lead somewhere different: the work, and the person. */}
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            <Link viewTransition to="/work" className={linkClass}>
              [What I build]
            </Link>
            <Link viewTransition to="/me" className={linkClass}>
              [Who I am]
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
