import HeroSection from '@/components/sections/hero-section';
import FeaturedProjectSection from '@/components/sections/featured-project-section';
import ServicesSection from '@/components/sections/services-section';
import ProjectsCarouselSection from '@/components/sections/projects-carousel-section';
import FaqSection from '@/components/sections/faq-section';
import DreamHomeSection from '@/components/sections/dream-home-section';
import CtaSection from '@/components/sections/cta-section';
import AnimatedContent from '@/components/animated-content';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimatedContent>
        <FeaturedProjectSection />
      </AnimatedContent>
      <AnimatedContent>
        <ServicesSection />
      </AnimatedContent>
      <AnimatedContent>
        <ProjectsCarouselSection />
      </AnimatedContent>
      <AnimatedContent>
        <FaqSection />
      </AnimatedContent>
      <AnimatedContent>
        <DreamHomeSection />
      </AnimatedContent>
      <AnimatedContent>
        <CtaSection />
      </AnimatedContent>
    </>
  );
}
