
export type Project = {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[] | string; // Can be an array or a single string
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    location: string;
    status: 'Completed' | 'Under Construction' | 'Sold';
  };
  createdAt?: { // Added for sorting featured project
    seconds: number;
    nanoseconds: number;
  } | Date;
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
