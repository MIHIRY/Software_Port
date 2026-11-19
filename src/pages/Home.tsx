import { siteConfig } from '../config';
import { useDocumentMeta } from '../useDocumentMeta';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Certifications from '../components/Certifications';
import Publications from '../components/Publications';
import Blogs from '../components/Blogs';
import Contact from '../components/Contact';

export default function Home() {
  useDocumentMeta(siteConfig.pageMeta.home);

  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Experience />
      <Projects />
      <Education />
      <Certifications />
      <Publications />
      <Blogs />
      <Contact />
    </>
  );
}
