
import type { Service, FAQ, ContactMessage } from './types';
import { Building, Home, Laptop } from 'lucide-react';

export const services: Service[] = [
  {
    icon: Building,
    title: 'Development',
    description: 'From land acquisition to architectural design and construction, we manage the entire development process to create exceptional properties.',
  },
  {
    icon: Home,
    title: 'Property Management',
    description: 'Our comprehensive property management services ensure your investment is well-maintained and profitable, providing peace of mind for homeowners.',
  },
  {
    icon: Laptop,
    title: 'IT Solutions',
    description: 'We provide cutting-edge IT services, including consultation and managed solutions, to streamline operations for businesses in any sector.',
  }
];

export const faqs: FAQ[] = [
  {
    question: 'What makes Landmark New Homes different?',
    answer: 'Our commitment to quality, innovation, and customer satisfaction sets us apart. We use only the finest materials and work with renowned architects to create homes that are not just beautiful but also built to last. Our client-centric approach ensures a seamless experience from start to finish.'
  },
  {
    question: 'Can I customize my home design?',
    answer: 'Yes, for many of our "under construction" projects, we offer a range of customization options. You can work with our design team to select finishes, fixtures, and layouts that match your personal style and needs. Please contact us for specific project details.'
  },
  {
    question: 'What kind of IT solutions do you offer?',
    answer: 'We offer a wide range of IT services beyond real estate, including IT consulting, managed IT services, network security, cloud solutions, and custom software development. Our goal is to provide comprehensive tech support for businesses of all sizes.'
  },
  {
    question: 'How do I schedule a project viewing?',
    answer: 'You can schedule a viewing by contacting us through the form on our website or by calling our sales office directly. We would be delighted to give you a personal tour of our available properties.'
  }
];

// Mock database for contact messages is now removed and handled by Firestore.
export let contactMessages: ContactMessage[] = [];
