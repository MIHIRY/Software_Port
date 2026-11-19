import { useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import CredentialsPage from './pages/CredentialsPage';
import NotFound from './pages/NotFound';
import AboutV2 from './about-v2/AboutV2';
import Landing from './about-v2/Landing';

/** Scrolls to the hash target on navigation, or to the top on a plain route change. */
function ScrollManager() {
  // `key` changes on every navigation, including a push to the location you are
  // already on. Without it, clicking a link to the page you are halfway down
  // would leave you where you were, because pathname and hash never changed.
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
      // Two doors: "Who I am" (/me, short) and "What I build" (/work, in depth).
      { path: '/', element: <Landing /> },
      { path: '/me', element: <AboutV2 /> },
      { path: '/work', element: <ProjectsPage /> },
      { path: '/skills', element: <SkillsPage /> },
      // Jobs, degrees, certificates and papers; linked from the /work Certifications card.
      { path: '/credentials', element: <CredentialsPage /> },
      // Old addresses. Anyone holding one still lands on a page rather than the 404.
      // /about was the Apple-style résumé, now retired.
      { path: '/about', element: <Navigate to="/me" replace /> },
      { path: '/about-new', element: <Navigate to="/me" replace /> },
      { path: '/projects', element: <Navigate to="/work" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
