
export type Project = {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  status: 'Completed' | 'Under Construction' | 'Sold';
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  isFeatured?: boolean;
};

export type Service = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
};
