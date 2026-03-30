
export type Program = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  dataAiHint: string;
  updates?: string[];
  location?: { lat: number; lng: number; name: string };
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  imageUrl: string;
  dataAiHint: string;
  summary: string;
  content: string;
};

export type LeadershipMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  dataAiHint: string;
};
