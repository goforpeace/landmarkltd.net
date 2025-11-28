

export type Note = {
  text: string;
  createdAt: { seconds: number; nanoseconds: number; } | Date;
};

export type FlatType = {
  name: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  verandas: number;
};

export type Project = {
  id: string; // Now mandatory
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  flatTypes: FlatType[];
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

export type CallbackRequest = {
  id: string;
  name: string;
  phone: string;
  projectId: string;
  projectName: string;
  status: 'New' | 'Contacted';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  notes?: Note[];
};
