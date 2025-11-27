
import type { Project, Service, FAQ, ContactMessage } from './types';
import { Building, Home, Laptop } from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const projects: Project[] = [
  {
    id: '1',
    title: 'The Azure Residence',
    shortDescription: 'Luxurious apartments with stunning city views.',
    description: 'The Azure Residence offers a unique blend of modern architecture and luxurious living. Each apartment is designed with meticulous attention to detail, featuring spacious layouts, high-end finishes, and panoramic windows that offer breathtaking views of the cityscape. Residents can enjoy a range of exclusive amenities including a rooftop pool, a state-of-the-art fitness center, and a private cinema.',
    images: [getImage('project-carousel-1'), getImage('featured-project-1'), getImage('project-detail-1')],
    details: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      location: 'Downtown Metropolis',
      status: 'Completed',
    }
  },
  {
    id: '2',
    title: 'Greenwich Meadows',
    shortDescription: 'Family homes in a serene suburban setting.',
    description: 'Nestled in a peaceful suburban landscape, Greenwich Meadows is the perfect community for families. These beautiful homes combine classic design with modern functionality, featuring open-plan living areas, private gardens, and access to community parks and top-rated schools. It\'s an idyllic escape from the hustle and bustle of the city, without sacrificing convenience.',
    images: [getImage('project-carousel-2'), getImage('suburban home'), getImage('project-detail-2')],
    details: {
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      location: 'Oak Creek Suburb',
      status: 'Under Construction',
    }
  },
  {
    id: '3',
    title: 'The Coastal Collection',
    shortDescription: 'Exclusive villas with direct beach access.',
    description: 'Experience the ultimate in coastal living with The Coastal Collection. These exclusive villas offer private beach access and stunning ocean views. Designed for relaxation and entertainment, each villa boasts expansive terraces, infinity pools, and interiors that seamlessly blend indoor and outdoor living. This is more than a home; it\'s a permanent vacation.',
    images: [getImage('project-carousel-4'), getImage('beachfront house'), getImage('project-detail-4')],
    details: {
      bedrooms: 5,
      bathrooms: 5,
      area: 4500,
      location: 'Sapphire Bay',
      status: 'Sold',
    }
  },
   {
    id: '4',
    title: 'Urban Loft Apartments',
    shortDescription: 'Chic and stylish lofts in the heart of the arts district.',
    description: 'Located in the vibrant arts district, Urban Loft Apartments are designed for the modern creative. Featuring open-concept layouts, high ceilings, and industrial-chic finishes, these lofts provide a versatile space to live, work, and create. Step outside and you\'re surrounded by galleries, theaters, and the city\'s best dining experiences.',
    images: [getImage('project-carousel-2'), getImage('modern interior'), getImage('project-detail-2')],
    details: {
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        location: 'Arts District',
        status: 'Completed'
    }
  }
];

export const featuredProject: Project = projects[0];

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

// Mock database for contact messages
export let contactMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    message: 'I am very interested in The Azure Residence. Can I get more information?',
    createdAt: new Date(),
  }
];
