import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import SocialIcons from './SocialIcons';

/** apple.com-style product hero: centred, two-tone headline, one pill and one link. */
export default function Hero() {
  return (
    <section className="flex min-h-[88vh] flex-col items-center justify-center bg-white px-6 pb-20 pt-32 text-center sm:pt-36">
      <img
        src={siteConfig.avatar}
        alt=""
        width={112}
        height={112}
        decoding="async"
        className="animate-fadeIn h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
      />
      {/* text-balance keeps "Engineer." from sitting alone on a phone's last line. */}
      <h1 className="animate-fadeIn-delay-1 mt-8 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[56px] lg:text-[72px] xl:text-[80px]">
        <span className="block">{siteConfig.name}.</span>{' '}
        <span className="block text-apple-gray">{siteConfig.title}.</span>
      </h1>
      <p className="animate-fadeIn-delay-2 mt-6 max-w-[36rem] text-[19px] leading-[1.42] tracking-[-0.01em] text-apple-gray sm:text-[21px]">
        {siteConfig.tagline}
      </p>
      <div className="animate-fadeIn-delay-3 mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
        <Link viewTransition to="/" className="apple-button">
          View my projects
        </Link>
        <a
          href={siteConfig.social.calendar}
          target="_blank"
          rel="noopener noreferrer"
          className="apple-link text-[17px]"
        >
          Schedule a coffee chat <span aria-hidden="true">›</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
      <SocialIcons className="animate-fadeIn-delay-3 mt-10" size={20} />
    </section>
  );
}
