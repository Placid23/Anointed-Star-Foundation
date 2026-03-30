import type { Program, NewsArticle, LeadershipMember } from '@/lib/types';
import imageData from '@/lib/placeholder-images.json';

export const programsData: Program[] = [
  {
    id: '1',
    slug: 'youth-empowerment',
    title: 'Youth Empowerment Initiative',
    shortDescription: 'Equipping young individuals with skills and resources for a brighter future.',
    longDescription: 'Our Youth Empowerment Initiative focuses on providing education, mentorship, and vocational training to underprivileged youth. We aim to create a generation of confident and skilled individuals ready to contribute positively to society.',
    imageUrl: imageData.programs.find(p => p.id === '1')?.src || 'https://placehold.co/600x400.png',
    dataAiHint: imageData.programs.find(p => p.id === '1')?.hint || 'youth education',
    updates: ['Successfully launched new coding bootcamp in Q2.', 'Partnered with local businesses for internship opportunities.'],
    location: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles Community Center' }
  },
  {
    id: '2',
    slug: 'community-health',
    title: 'Community Health Program',
    shortDescription: 'Providing accessible healthcare services and health education to remote communities.',
    longDescription: 'The Community Health Program sets up mobile clinics and health camps in areas with limited access to medical facilities. We offer free check-ups, basic treatments, and health awareness sessions on topics like hygiene and nutrition.',
    imageUrl: imageData.programs.find(p => p.id === '2')?.src || 'https://placehold.co/600x400.png',
    dataAiHint: imageData.programs.find(p => p.id === '2')?.hint || 'community healthcare',
    updates: ['Reached 500+ patients this month.', 'New dental care unit added to mobile clinic.'],
    location: { lat: -1.2921, lng: 36.8219, name: 'Nairobi Rural Outreach' }
  },
  {
    id: '3',
    slug: 'environmental-conservation',
    title: 'Environmental Conservation Project',
    shortDescription: 'Protecting and restoring natural habitats through community involvement.',
    longDescription: 'This project focuses on reforestation, wildlife protection, and promoting sustainable practices. We work closely with local communities to ensure the long-term health of our planet.',
    imageUrl: imageData.programs.find(p => p.id === '3')?.src || 'https://placehold.co/600x400.png',
    dataAiHint: imageData.programs.find(p => p.id === '3')?.hint || 'nature conservation',
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
    imageUrl: imageData.news.find(n => n.id === '1')?.src || 'https://placehold.co/600x400.png',
    dataAiHint: imageData.news.find(n => n.id === '1')?.hint || 'charity event',
    summary: 'Our annual fundraising gala exceeded all expectations, raising crucial funds for our upcoming projects. A heartfelt thank you to all our donors and supporters!',
    content: '<p>The Anointed Foundation Annual Fundraising Gala, held on July 10th, was an unforgettable evening of generosity and community spirit. We are thrilled to announce that we surpassed our fundraising goal, raising over $200,000! These funds will be instrumental in expanding our Youth Empowerment Initiative and launching new health camps under our Community Health Program.</p><p>The event featured inspiring speeches from beneficiaries, captivating performances, and a lively auction. We extend our deepest gratitude to our sponsors, dedicated volunteers, and every guest who attended and contributed to this remarkable success. Your support empowers us to continue making a meaningful impact in the lives of those we serve.</p><p>Stay tuned for more updates on how these funds are being utilized and the positive changes they bring.</p>',
  },
  {
    id: '2',
    slug: 'new-partnership-tech-company',
    title: 'Anointed Foundation Announces Strategic Partnership with TechForward Inc.',
    date: '2024-06-28',
    author: 'John Smith, CEO',
    imageUrl: imageData.news.find(n => n.id === '2')?.src || 'https://placehold.co/600x400.png',
    dataAiHint: imageData.news.find(n => n.id === '2')?.hint || 'business partnership',
    summary: 'We are excited to partner with TechForward Inc. to enhance our digital literacy programs and provide cutting-edge resources to our beneficiaries.',
    content: '<p>Anointed Foundation is delighted to announce a new strategic partnership with TechForward Inc., a leading innovator in educational technology. This collaboration will significantly bolster our Youth Empowerment Initiative by integrating TechForward’s state-of-the-art learning platforms and providing access to specialized tech training modules.</p><p>Through this partnership, we aim to equip young individuals with essential digital skills, preparing them for the demands of the modern workforce. TechForward Inc. will also support our efforts by providing mentorship from their experienced professionals and donating refurbished computer hardware for our community centers.</p><p>"We believe that access to technology and quality education is a game-changer," said Sarah Chen, CEO of TechForward Inc. "We are proud to support Anointed Foundation in their mission to create brighter futures."</p><p>This partnership marks a significant step forward in our commitment to providing comprehensive and impactful programs. We look forward to the positive outcomes this collaboration will bring to our communities.</p>',
  },
  {
    id: '3',
    slug: 'scholarship-program-launch',
    title: 'New Scholarship Program Launched to Support 50 Students',
    date: '2024-08-01',
    author: 'Aisha Khan, Director of Programs',
    imageUrl: imageData.news.find(n => n.id === '3')?.src || 'https://placehold.co/600x400.png',
    dataAiHint: imageData.news.find(n => n.id === '3')?.hint || 'scholarship award',
    summary: 'Our new "Stars of Tomorrow" scholarship program will cover tuition and expenses for 50 exceptional students from low-income backgrounds for the upcoming academic year.',
    content: '<p>We are proud to launch the "Stars of Tomorrow" Scholarship Program, a new initiative aimed at breaking down financial barriers to higher education. For its inaugural year, the program will provide full academic scholarships to 50 talented and deserving students from underserved communities.</p><p>The scholarship covers tuition fees, books, and a living stipend to ensure students can focus fully on their studies. "Education is the most powerful tool for upward mobility," said our Founder, Dr. Stella Placid. "With this program, we are investing not just in individuals, but in the future leadership of our communities."</p><p>Applications are now open, and we encourage all eligible students to apply. The selection will be based on academic merit, community involvement, and financial need.</p>',
  },
  {
    id: '4',
    slug: 'environmental-workshop-success',
    title: 'Community Conservation Workshop a Great Success',
    date: '2024-07-22',
    author: 'Samuel Green, COO',
    imageUrl: imageData.news.find(n => n.id === '4')?.src || 'https://placehold.co/600x400.png',
    dataAiHint: imageData.news.find(n => n.id === '4')?.hint || 'environmental workshop',
    summary: 'Over 100 community members participated in our Environmental Conservation Workshop, planting over 500 trees and learning about sustainable practices.',
    content: '<p>Our Environmental Conservation Project hosted a highly successful workshop last weekend, bringing together families, volunteers, and local leaders to make a tangible difference. The day was filled with activities, including a tree-planting drive where over 500 native saplings were planted in the local park.</p><p>Participants also attended sessions on waste reduction, composting, and water conservation, led by environmental experts. It was inspiring to see so many people, young and old, passionate about protecting our shared environment. The event not only contributed to local reforestation efforts but also fostered a stronger sense of community ownership over our natural spaces.</p><p>Thank you to everyone who participated and to our partners who made this day possible.</p>',
  },
];


export const leadershipData: LeadershipMember[] = [
  {
    id: '1',
    name: 'Dr. Stella Placid', 
    role: 'Founder & CEO',
    bio: 'Dr. Placid has over 20 years of experience in non-profit management and community development. Her vision and dedication are the driving forces behind Anointed Foundation.',
    imageUrl: imageData.about.leadership.find(l => l.id === '1')?.src || 'https://placehold.co/300x300.png',
    dataAiHint: imageData.about.leadership.find(l => l.id === '1')?.hint || 'professional portrait woman',
  },
   {
    id: '4',
    name: 'Mr. Placid Ojiaku',
    role: 'President',
    bio: 'Mr. Ojiaku brings a wealth of experience in strategic leadership and corporate governance, guiding the foundation towards sustainable growth and greater impact.',
    imageUrl: imageData.about.leadership.find(l => l.id === '4')?.src || 'https://placehold.co/300x300.png',
    dataAiHint: imageData.about.leadership.find(l => l.id === '4')?.hint || 'professional portrait man suit',
  },
  {
    id: '2',
    name: 'Mr. Samuel Green',
    role: 'Chief Operations Officer',
    bio: 'Samuel oversees the daily operations and program implementation, ensuring efficiency and impact across all foundation activities.',
    imageUrl: imageData.about.leadership.find(l => l.id === '2')?.src || 'https://placehold.co/300x300.png',
    dataAiHint: imageData.about.leadership.find(l => l.id === '2')?.hint || 'professional portrait man',
  },
  {
    id: '3',
    name: 'Ms. Aisha Khan',
    role: 'Director of Programs',
    bio: 'Aisha is passionate about creating sustainable change. She leads the design and execution of our diverse programs, working closely with communities.',
    imageUrl: imageData.about.leadership.find(l => l.id === '3')?.src || 'https://placehold.co/300x300.png',
    dataAiHint: imageData.about.leadership.find(l => l.id === '3')?.hint || 'professional portrait woman smiling',
  },
];

export const getProgramBySlug = (slug: string): Program | undefined => {
  return programsData.find(program => program.slug === slug);
};

export const getNewsBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticlesData.find(article => article.slug === slug);
};
