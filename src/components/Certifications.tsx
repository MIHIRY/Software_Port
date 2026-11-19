import { siteConfig } from '../config';
import Section from './Section';

/** Laid out like an apple.com "Tech Specs" list: name and detail left, issuer right. */
export default function Certifications() {
  if (siteConfig.certifications.length === 0) return null;

  return (
    <Section id="certifications" title="Certifications" tone="mist">
      <ul className="divide-y divide-apple-line border-y border-apple-line">
        {siteConfig.certifications.map((cert) => (
          <li key={cert.title} className="grid gap-2 py-6 sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-10">
            <div>
              <h3 className="text-[19px] font-semibold leading-[1.25] tracking-[-0.01em]">{cert.title}</h3>
              <p className="mt-1 text-[17px] leading-[1.47] tracking-[-0.01em] text-apple-gray">{cert.description}</p>
              {'link' in cert && cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${cert.title} (opens in a new tab)`}
                  className="apple-link mt-2 inline-block text-[17px]"
                >
                  Verify <span aria-hidden="true">›</span>
                </a>
              )}
            </div>
            <p className="text-[14px] leading-[1.45] text-apple-gray sm:pt-0.5 sm:text-right">
              {cert.issuer}
              {cert.date && <span className="block">{cert.date}</span>}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
