import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { useDocumentMeta } from '../useDocumentMeta';
import { doors, intro } from './content';
import Eyes from './Eyes';
import './about-v2.css';

/**
 * The front door at /: two ways in, "Who I am" (the short, hand-drawn page) and
 * "What I build" (the detailed projects page). Same paper and ink as /me.
 */
export default function Landing() {
  useDocumentMeta(siteConfig.pageMeta.home);

  useEffect(() => {
    document.documentElement.classList.add('v2-root');
    return () => document.documentElement.classList.remove('v2-root');
  }, []);

  return (
    <div className="v2 v2-landing">
      <main className="v2-landing-inner">
        <Eyes />
        <h1 className="v2-h1" aria-label={intro.heading}>
          <span className="v2-accent">Hi</span>, I'm <span className="v2-accent">{intro.name}</span>.
        </h1>
        <p className="v2-landing-lede">{siteConfig.title}. Pick a door.</p>
        <ul className="v2-doors">
          {doors.map((door) => (
            <li key={door.to}>
              <Link viewTransition to={door.to} className="v2-door">
                <span className="v2-door-kicker">{door.kicker}</span>
                <span className="v2-door-title">{door.title}</span>
                <span className="v2-door-teaser">{door.teaser}</span>
                <span className="v2-door-foot">
                  {door.time}
                  <span className="v2-door-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
