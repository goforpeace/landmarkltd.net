import ContactForm from "@/components/contact-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl md:text-5xl text-primary">
              Get in Touch
            </CardTitle>
            <CardDescription className="pt-2 text-lg">
              We'd love to hear from you. Please fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
