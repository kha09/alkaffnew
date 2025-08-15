export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
}

export interface University {
  id: number;
  name: string;
  country: string;
  logo: string;
  ranking: string;
  students: string;
  programs: string;
  acceptance: string;
  color: string;
  flag: string;
  freeOfferLetter: boolean;
  departments?: Department[];
  location?: string;
  nameEn?: string;
  tuitionFee?: string;
  currency?: string;
  courses?: number;
  rating?: number;
  popular?: boolean;
  featured?: boolean;
  specializations?: string[];
}

export interface Department {
  id: number;
  name: string;
  programs?: Program[];
}

export interface Program {
  id: number;
  name: string;
  description: string;
  tuitionFees: string;
  duration: string;
  intakeMonths: string;
}

export interface Testimonial {
  id: number;
  name: string;
  program: string;
  text: string;
  rating: number;
  avatar: string;
  university: string;
  country: string;
  flag: string;
  date: string;
  hasVideo: boolean;
  featured: boolean;
  category: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  popular: boolean;
}

export interface HomePageContent {
  heroSlides: HeroSlide[];
  universities: University[];
  testimonials: Testimonial[];
  faqs: Faq[];
}
