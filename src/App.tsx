import { useEffect, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import NotFound from './pages/NotFound';

/** Scrolls to the hash target on navigation, or to the top on a plain route change. */
function ScrollManager() {
  // `key` changes on every navigation, including a push to the location you are
  // already on. Without it, clicking About from halfway down /about would leave
  // the page where it was, because pathname and hash never changed.
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key]);

  return null;
}

/**
 * The résumé's chrome, in the Apple register (SF Pro / Inter, apple.com palette).
 * The projects and skills pages carry their own header and keep IBM Plex Mono.
 */
function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white font-apple text-apple-ink antialiased">
      {/* First tab stop: skips the nine header links. Visible only when focused. */}
      <a href="#main" className="apple-button sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-[60]">
        Skip to content
      </a>
      <Header />
      {/* tabIndex lets the skip link move focus here, not just scroll. */}
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Root() {
  return (
    <>
      <ScrollManager />
      <Outlet />
    </>
  );
}

/**
 * A data router, not <BrowserRouter>. React Router only honours a Link's
 * `viewTransition` prop when `router.window` is set, which only the data router
 * does — with the declarative router the prop is silently ignored.
 */
export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // The work is the landing page; the résumé sits a click behind it.
      { path: '/', element: <ProjectsPage /> },
      {
        path: '/about',
        element: (
          <SiteLayout>
            <Home />
          </SiteLayout>
        ),
      },
      { path: '/skills', element: <SkillsPage /> },
      // /projects was the public url for the work for a while. Anyone holding
      // that link still lands on it rather than on the 404.
      { path: '/projects', element: <Navigate to="/" replace /> },
      {
        // Was rendering Home, so a mistyped url silently looked valid.
        path: '*',
        element: (
          <SiteLayout>
            <NotFound />
          </SiteLayout>
        ),
      },
    ],
  },
]);
