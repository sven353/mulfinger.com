// Client voices: verbatim excerpts from public LinkedIn recommendations, chosen by Sven on 2026-10-24.
// Used by the homepage, /advisory and /llms-full.txt. Photos supplied by Sven.
import wilhelm from '../assets/images/clients/wilhelm-taht.jpg';
import albrecht from '../assets/images/clients/albrecht-von-der-recke.jpg';
import sergi from '../assets/images/clients/sergi-estragues.jpg';

export type Testimonial = { id: string; name: string; role: string; company: string; quote: string; photo: ImageMetadata };

export const testimonials: Testimonial[] = [
  {
    id: 'wilhelm-taht',
    name: 'Wilhelm Taht',
    role: 'Senior Vice President and General Manager',
    company: 'Scopely',
    quote: 'Sven always seems to have just the right perspective, tool, process, or question to bring to the table. Sven’s style and insights made a real difference for me.',
    photo: wilhelm,
  },
  {
    id: 'albrecht-von-der-recke',
    name: 'Albrecht von der Recke',
    role: 'CEO EMEA and Board Member',
    company: 'fonYou',
    quote: 'Sven has a rare ability to quickly understand complex leadership and business situations, cut through noise, and challenge assumptions in a constructive way.',
    photo: albrecht,
  },
  {
    id: 'sergi-estragues',
    name: 'Sergi Estragues',
    role: 'General Manager Africa',
    company: 'Griffith Foods',
    quote: 'He has a way of asking questions that stop you in your tracks, the kind that make you pause, rethink assumptions, and see your own situation more clearly. Over time, that changes how you think, not just what you decide.',
    photo: sergi,
  },
];

export const linkedinRecommendations = 'https://www.linkedin.com/in/svenmulfinger/details/recommendations/';
