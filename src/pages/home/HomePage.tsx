import { Hero, Features, HowItWorks, Benefits, Testimonials, CTA } from './components';

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <CTA />
    </>
  );
};
