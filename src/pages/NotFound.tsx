import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { useDocumentMeta } from '../useDocumentMeta';

export default function NotFound() {
  useDocumentMeta(siteConfig.pageMeta.notFound);

  return (
    <section className="flex min-h-[70vh] items-center bg-white px-6 pb-24 pt-32">
      <div className="mx-auto w-full max-w-[980px]">
        <p className="text-[14px] font-semibold text-apple-orange">404</p>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[56px]">
          This page doesn’t exist.
        </h1>
        <p className="mt-5 max-w-xl text-[19px] leading-[1.42] tracking-[-0.01em] text-apple-gray sm:text-[21px]">
          The link may be out of date, or the address mistyped. Everything else is still where you
          left it.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link viewTransition to="/" className="apple-button">
            View projects
          </Link>
          {/* The work is the landing page, so the second way out is the résumé —
              otherwise both buttons went to the same place. */}
          <Link viewTransition to="/about" className="apple-link text-[17px]">
            About me <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
