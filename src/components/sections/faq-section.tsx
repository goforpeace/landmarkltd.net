import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqs } from '@/lib/data';

export default function FaqSection() {
  return (
    <section id="faq" className="w-full bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="lg:pr-8">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Why Choose Landmark?</h2>
          <p className="text-lg text-muted-foreground mb-4">
            At Landmark New Homes, we don't just build houses; we create lifestyles. Our philosophy is rooted in a deep understanding of our clients' aspirations, combined with an unwavering commitment to quality and craftsmanship.
          </p>
          <p className="text-muted-foreground">
            With decades of experience, a portfolio of successful projects, and a forward-thinking approach to design and technology, we deliver properties that are not only beautiful and functional but also sound investments for the future. Choose us for a partnership built on trust, transparency, and a shared vision of your dream home.
          </p>
        </div>
        <div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-6 lg:mb-4">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
