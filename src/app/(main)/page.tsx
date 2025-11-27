import HeroSection from '@/components/sections/hero-section';
import FeaturedProjectSection from '@/components/sections/featured-project-section';
import ServicesSection from '@/components/sections/services-section';
import ProjectsCarouselSection from '@/components/sections/projects-carousel-section';
import FaqSection from '@/components/sections/faq-section';
import DreamHomeSection from '@/components/sections/dream-home-section';
import CtaSection from '@/components/sections/cta-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProjectSection />
      <ServicesSection />
      <ProjectsCarouselSection />
      <FaqSection />
      <DreamHomeSection />
      <CtaSection />
    </>
  );
}
