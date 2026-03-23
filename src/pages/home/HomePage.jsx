import { Hero, Features, HowItWorks, Benefits, Testimonials, CTA } from './components';

export const HomePage = () => (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      {/* eslint-disable-next-line react/jsx-pascal-case -- CTA is an intentional abbreviation */}
      <CTA />
    </>
  );
