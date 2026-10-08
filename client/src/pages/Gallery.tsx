import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// Import real gallery images
import distributionDrive from '../assets/gallery/distribution_drive.jpg';
import educationColoring from '../assets/gallery/education_coloring.jpg';
import teamWithChildren1 from '../assets/gallery/team_with_children_1.jpg';
import teamWithChildren2 from '../assets/gallery/team_with_children_2.jpg';
import treePlantation from '../assets/gallery/tree_plantation.jpg';
import awardCeremony from '../assets/gallery/award_ceremony.jpg';
import plantingSapling from '../assets/gallery/planting_sapling.jpg';
import plantationGroup from '../assets/gallery/plantation_group.jpg';
import volunteerDiscussion from '../assets/gallery/volunteer_discussion.jpg';
import mhfLogo from '../assets/gallery/mhf_logo.jpg';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Community Distribution Drive',
    description: 'Our volunteers distributing essential supplies and materials to community members in need.',
    imageUrl: distributionDrive,
    category: 'community',
  },
  {
    id: 2,
    title: 'Education & Creative Learning',
    description: 'Volunteers engaging children in creative activities like coloring and drawing to foster learning through art.',
    imageUrl: educationColoring,
    category: 'education',
  },
  {
    id: 3,
    title: 'Team with Children — Learning Session',
    description: 'Our dedicated team sitting with children from underprivileged communities, sharing knowledge and books.',
    imageUrl: teamWithChildren1,
    category: 'education',
  },
  {
    id: 4,
    title: 'Community Outreach Program',
    description: 'Volunteers spending quality time with children, providing educational materials and creative activities.',
    imageUrl: teamWithChildren2,
    category: 'community',
  },
  {
    id: 5,
    title: 'Tree Plantation Drive',
    description: 'Our team coming together for a tree plantation drive, contributing to environmental conservation and a greener future.',
    imageUrl: treePlantation,
    category: 'environment',
  },
  {
    id: 6,
    title: 'Award & Felicitation Ceremony',
    description: 'Recognition and felicitation at an official event, celebrating the impact and contributions of our foundation.',
    imageUrl: awardCeremony,
    category: 'events',
  },
  {
    id: 7,
    title: 'Planting a Sapling',
    description: 'Volunteers carefully planting a new sapling as part of our green initiative to nurture a sustainable environment.',
    imageUrl: plantingSapling,
    category: 'environment',
  },
  {
    id: 8,
    title: 'Plantation Team — Group Photo',
    description: 'Our team and community members posing together after a successful tree plantation drive.',
    imageUrl: plantationGroup,
    category: 'environment',
  },
  {
    id: 9,
    title: 'Volunteer Team Discussion',
    description: 'Volunteers coordinating and planning on the ground to ensure smooth execution of community programs.',
    imageUrl: volunteerDiscussion,
    category: 'volunteers',
  },
  {
    id: 10,
    title: 'Mahamana Hopes Foundation Logo',
    description: 'Inspired by values driven by compassion. Empowering minds, building futures.',
    imageUrl: mhfLogo,
    category: 'community',
  },
];

const categories = [
  { key: 'all', label: 'All Photos' },
  { key: 'education', label: 'Education' },
  { key: 'community', label: 'Community' },
  { key: 'environment', label: 'Environment' },
  { key: 'events', label: 'Events' },
  { key: 'volunteers', label: 'Volunteers' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  // Handle keyboard navigation in lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  return (
    <>
      <Helmet>
        <title>Gallery — Mahamana Hopes Foundation</title>
        <meta
          name="description"
          content="See the real impact of Mahamana Hopes Foundation through our photo gallery — community drives, education programs, tree plantations, and more."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src={teamWithChildren1}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-max relative z-10">
          <AnimatedSection>
            <span className="section-label !text-green-300">
              <Camera className="w-4 h-4" /> Our Gallery
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-5">
              Moments of <span className="text-green-300">Impact</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              Every photo tells a story of change, compassion, and community. Explore the real moments from our programs and initiatives.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-[72px] z-30">
        <div className="container-max py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-full font-heading font-semibold text-sm transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-primary-500'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-gray-50/50">
        <div className="container-max">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.1}>
                  <div
                    className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                    onClick={() => openLightbox(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                    id={`gallery-item-${item.id}`}
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-3 py-1 bg-green-500/90 text-white text-xs font-heading font-semibold rounded-full mb-2 capitalize">
                          {item.category}
                        </span>
                        <h3 className="text-white font-heading font-bold text-lg leading-tight mb-1">
                          {item.title}
                        </h3>
                        <p className="text-white/70 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Zoom icon */}
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-heading">No photos found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary-500 py-10">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Photos', value: galleryItems.length },
              { label: 'Programs Covered', value: 5 },
              { label: 'Communities Reached', value: '10+' },
              { label: 'Volunteers Captured', value: '20+' },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div>
                  <p className="text-3xl md:text-4xl font-heading font-bold text-white">{stat.value}</p>
                  <p className="text-white/60 text-sm font-heading mt-1">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-label="Image lightbox"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev button */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[85vh] px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredItems[lightboxIndex].imageUrl}
                alt={filteredItems[lightboxIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg mx-auto"
              />
              <div className="text-center mt-4">
                <h3 className="text-white font-heading font-bold text-xl !text-white">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  {filteredItems[lightboxIndex].description}
                </p>
                <p className="text-white/40 text-xs mt-2 font-heading">
                  {lightboxIndex + 1} / {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
