import { useEffect, useRef, useState } from 'react';
import { Image } from '@/components/ui/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSiteContent } from '@/data/contentStore';
import { Gallery } from '@/entities';

const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full">
        <Image src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  );
};

export default function GalleryPage() {
  const { galleryItems: galleryContent, galleryPageContent } = useSiteContent();
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [filteredItems, setFilteredItems] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    setGalleryItems(galleryContent as Gallery[]);
    setIsLoading(false);
  }, [galleryContent]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter((item) => item.category === selectedCategory));
    }
  }, [galleryItems, selectedCategory]);

  const categories = Array.from(new Set(galleryItems.map((item) => item.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative w-full h-96 md:h-[500px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage src={galleryPageContent.hero.image} alt={galleryPageContent.hero.imageAlt} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6">
            {galleryPageContent.hero.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-paragraph text-lg text-white/80 max-w-3xl">
            {galleryPageContent.hero.description}
          </motion.p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="w-full border-b border-foreground/10 bg-background sticky top-20 z-40">
          <div className="max-w-[100rem] mx-auto px-8 py-8">
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setSelectedCategory('all')} className={`px-6 py-3 font-paragraph text-base transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground border border-foreground/20 hover:border-accent-blue hover:text-accent-blue'}`}>
                {galleryPageContent.allPhotosLabel}
              </button>
              {categories.map((category) => (
                <button key={category} onClick={() => setSelectedCategory(category!)} className={`px-6 py-3 font-paragraph text-base transition-colors ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground border border-foreground/20 hover:border-accent-blue hover:text-accent-blue'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="w-full max-w-[100rem] mx-auto px-8 py-24">
        <div className="min-h-[600px]">
          {isLoading ? null : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <motion.div key={item._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.05 }} className="group">
                  <div className="relative overflow-hidden mb-4">
                    <Image src={item.image || galleryPageContent.imageFallback} alt={item.title || 'Gallery image'} className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
                  </div>

                  {(item.title || item.description) && (
                    <div className="space-y-2">
                      {item.title && <h3 className="font-heading text-xl text-foreground">{item.title}</h3>}
                      {item.description && <p className="font-paragraph text-base text-secondary leading-relaxed">{item.description}</p>}
                      {item.dateTaken && (
                        <p className="font-paragraph text-sm text-secondary">
                          {new Date(item.dateTaken).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Camera className="w-16 h-16 text-secondary/40 mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-heading text-2xl text-foreground mb-4">{galleryPageContent.emptyTitle}</h3>
              <p className="font-paragraph text-base text-secondary">
                {selectedCategory === 'all' ? galleryPageContent.emptyDescriptionAll : galleryPageContent.emptyDescriptionCategory}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
