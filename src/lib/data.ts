
import type { Program, NewsArticle, LeadershipMember } from '@/lib/types';

export const programsData: Program[] = [
  {
    id: '1',
    slug: 'youth-empowerment',
    title: 'Youth Empowerment Initiative',
    shortDescription: 'Equipping young individuals with skills and resources for a brighter future.',
    longDescription: 'Our Youth Empowerment Initiative focuses on providing education, mentorship, and vocational training to underprivileged youth. We aim to create a generation of confident and skilled individuals ready to contribute positively to society.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'youth education',
    updates: ['Successfully launched new coding bootcamp in Q2.', 'Partnered with local businesses for internship opportunities.'],
    location: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles Community Center' }
  },
  {
    id: '2',
    slug: 'community-health',
    title: 'Community Health Program',
    shortDescription: 'Providing accessible healthcare services and health education to remote communities.',
    longDescription: 'The Community Health Program sets up mobile clinics and health camps in areas with limited access to medical facilities. We offer free check-ups, basic treatments, and health awareness sessions on topics like hygiene and nutrition.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'community healthcare',
    updates: ['Reached 500+ patients this month.', 'New dental care unit added to mobile clinic.'],
    location: { lat: -1.2921, lng: 36.8219, name: 'Nairobi Rural Outreach' }
  },
  {
    id: '3',
    slug: 'environmental-conservation',
    title: 'Environmental Conservation Project',
    shortDescription: 'Protecting and restoring natural habitats through community involvement.',
    longDescription: 'This project focuses on reforestation, wildlife protection, and promoting sustainable practices. We work closely with local communities to ensure the long-term health of our planet.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'nature conservation',
    location: { lat: -13.786, lng: -60.029, name: 'Amazon Rainforest Initiative' }
  },
];

export const newsArticlesData: NewsArticle[] = [
  {
    id: '1',
    slug: 'annual-gala-success',
    title: 'Annual Fundraising Gala: A Resounding Success!',
    date: '2024-07-15',
    author: 'Jane Doe, Communications Lead',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'charity event',
    summary: 'Our annual fundraising gala exceeded all expectations, raising crucial funds for our upcoming projects. A heartfelt thank you to all our donors and supporters!',
    content: '&lt;p&gt;The Anointed Star Foundation Annual Fundraising Gala, held on July 10th, was an unforgettable evening of generosity and community spirit. We are thrilled to announce that we surpassed our fundraising goal, raising over $200,000! These funds will be instrumental in expanding our Youth Empowerment Initiative and launching new health camps under our Community Health Program.&lt;/p&gt;&lt;p&gt;The event featured inspiring speeches from beneficiaries, captivating performances, and a lively auction. We extend our deepest gratitude to our sponsors, dedicated volunteers, and every guest who attended and contributed to this remarkable success. Your support empowers us to continue making a meaningful impact in the lives of those we serve.&lt;/p&gt;&lt;p&gt;Stay tuned for more updates on how these funds are being utilized and the positive changes they bring.&lt;/p&gt;',
  },
  {
    id: '2',
    slug: 'new-partnership-tech-company',
    title: 'Anointed Star Foundation Announces Strategic Partnership with TechForward Inc.',
    date: '2024-06-28',
    author: 'John Smith, CEO',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'business partnership',
    summary: 'We are excited to partner with TechForward Inc. to enhance our digital literacy programs and provide cutting-edge resources to our beneficiaries.',
    content: '&lt;p&gt;Anointed Star Foundation is delighted to announce a new strategic partnership with TechForward Inc., a leading innovator in educational technology. This collaboration will significantly bolster our Youth Empowerment Initiative by integrating TechForward’s state-of-the-art learning platforms and providing access to specialized tech training modules.&lt;/p&gt;&lt;p&gt;Through this partnership, we aim to equip young individuals with essential digital skills, preparing them for the demands of the modern workforce. TechForward Inc. will also support our efforts by providing mentorship from their experienced professionals and donating refurbished computer hardware for our community centers.&lt;/p&gt;&lt;p&gt;"We believe that access to technology and quality education is a game-changer," said Sarah Chen, CEO of TechForward Inc. "We are proud to support Anointed Star Foundation in their mission to create brighter futures."&lt;/p&gt;&lt;p&gt;This partnership marks a significant step forward in our commitment to providing comprehensive and impactful programs. We look forward to the positive outcomes this collaboration will bring to our communities.&lt;/p&gt;',
  },
];

export const leadershipData: LeadershipMember[] = [
  {
    id: '1',
    name: 'Dr. Stella Placid', 
    role: 'Founder &amp; CEO',
    bio: 'Dr. Placid has over 20 years of experience in non-profit management and community development. Her vision and dedication are the driving forces behind Anointed Star Foundation.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'professional portrait woman',
  },
  {
    id: '2',
    name: 'Mr. Samuel Green',
    role: 'Chief Operations Officer',
    bio: 'Samuel oversees the daily operations and program implementation, ensuring efficiency and impact across all foundation activities.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'professional portrait man',
  },
  {
    id: '3',
    name: 'Ms. Aisha Khan',
    role: 'Director of Programs',
    bio: 'Aisha is passionate about creating sustainable change. She leads the design and execution of our diverse programs, working closely with communities.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'professional portrait woman smiling',
  },
];

export const getProgramBySlug = (slug: string): Program | undefined => {
  return programsData.find(program => program.slug === slug);
};

export const getNewsBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticlesData.find(article => article.slug === slug);
};
