import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { useDocumentMeta } from '../useDocumentMeta';
import { books, contact, intro, moreCount, pages, rows } from './content';
import { CatOnBooks } from './art';
import Eyes from './Eyes';
import Line from './line/Line';
import PhotoPile from './pile/PhotoPile';
import './about-v2.css';

/**
 * About v2: Mihir's résumé page in the style of gregskril.com (original art,
 * free fonts). Lives at /me as "Who I am"; the Apple résumé stays at /about.
 * Elements the line routes through carry a `data-anchor`.
 */
export default function AboutV2() {
  useDocumentMeta(siteConfig.pageMeta.me);

  useEffect(() => {
    document.documentElement.classList.add('v2-root');
    return () => document.documentElement.classList.remove('v2-root');
  }, []);

  return (
    <div className="v2" data-v2-page>
      <Line />

      <header className="v2-hello">
        <div className="v2-portrait" data-anchor="portrait" role="img" aria-label="A one-line drawing of Mihir" />
        <div className="v2-hello-copy">
          <Eyes />
          <div className="v2-name-row">
            <h1 className="v2-h1" data-anchor="h1" aria-label={intro.heading}>
              <span className="v2-accent">Hi</span>, I'm <span className="v2-accent">{intro.name}</span>.
            </h1>
            {/* Beside the name when the column is wide enough, below it otherwise. */}
            <nav className="v2-name-links" aria-label="Other pages" data-anchor="name-links">
              {pages.map((page) => (
                <Link key={page.to} viewTransition to={page.to} className="v2-pill">
                  {page.label}
                </Link>
              ))}
            </nav>
          </div>
          <p>{intro.line}</p>
          <p className="v2-aside">{intro.aside}</p>
        </div>
      </header>

      <main>
        <section className="v2-books v2-section" aria-labelledby="v2-books-title">
          <CatOnBooks className="v2-books-art" />
          <div className="v2-books-copy">
            <h2 id="v2-books-title" className="v2-h2">
              {books.heading[0]}{' '}
              <span className="v2-nowrap" data-anchor="books-phrase">
                {books.heading[1]}
              </span>
            </h2>
            <p>{books.body}</p>
            <div className="v2-pills">
              <Link viewTransition to={books.links[0].to!} className="v2-pill">
                {books.links[0].label}
              </Link>
              <a href={books.links[1].href} target="_blank" rel="noopener noreferrer" className="v2-pill">
                {books.links[1].label} <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>

        <section className="v2-section v2-things" aria-labelledby="v2-things-title">
          <h2 id="v2-things-title" className="v2-h2 text-center">
            Some things I made
          </h2>
          <ul className="v2-rows">
            {rows.map((row, i) => (
              <li key={row.link}>
                <a href={row.link} target="_blank" rel="noopener noreferrer" className="v2-row">
                  <span className="v2-row-name">
                    <span data-anchor={i === 0 ? 'row-name' : undefined}>{row.name}</span>
                  </span>
                  <span className="v2-row-desc">{row.description}</span>
                  <span className="v2-row-arrow" aria-hidden="true">
                    ↗
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          {/* The line draws one tally mark here for each project not listed. */}
          <div className="v2-tally" data-anchor="tally" aria-hidden="true" />
          <p className="v2-note">
            Plus {moreCount} more, from credit-risk models to NLP research.
            <Link viewTransition to="/work" className="v2-link">
              See more →
            </Link>
          </p>
        </section>

        <section className="v2-section" aria-labelledby="v2-photos-title">
          <div className="v2-photos-head">
            <h2 id="v2-photos-title" className="v2-h2">
              From my camera roll
            </h2>
            <p className="v2-hint">
              <span className="v2-hint-mouse">Drag them around, or click one for a closer look.</span>
              <span className="v2-hint-touch">Tap one for a closer look, then swipe.</span>
            </p>
          </div>
          <PhotoPile />
        </section>

        <section className="v2-section v2-hi" aria-labelledby="v2-hi-title">
          <img src={siteConfig.avatar} alt="" width={112} height={112} className="v2-avatar" />
          <h2 id="v2-hi-title" className="v2-h2">
            Say hi<span className="sr-only">: contact links</span>
          </h2>
          <div className="v2-pills" data-anchor="pills">
            {contact.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="v2-pill"
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
                {link.external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            ))}
          </div>
          <div className="v2-tail" data-anchor="tail" aria-hidden="true" />
        </section>
      </main>
    </div>
  );
}
