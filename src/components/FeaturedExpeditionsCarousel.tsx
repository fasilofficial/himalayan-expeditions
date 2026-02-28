import { Image } from '@/components/ui/image';
import { useSiteContent } from '@/data/contentStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const AUTO_ADVANCE_INTERVAL = 5000;

export default function FeaturedExpeditionsCarousel({ featuredExpeditions = [] }) {
  const { homePageContent } = useSiteContent();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const total = featuredExpeditions.length;

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent((index + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_ADVANCE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const handleManualNav = (fn) => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, AUTO_ADVANCE_INTERVAL);
  };

  if (!total) return null;

  const expedition = featuredExpeditions[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] } },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] } }),
  };

  const contentVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] } },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }),
  };

  return (
    <section className="w-full py-24 md:py-32 bg-background">
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border pb-8">
          <div>
            <span className="text-accent-blue font-paragraph text-sm tracking-widest uppercase mb-2 block">
              {homePageContent.featuredCarousel.eyebrow}
            </span>
            <h2 className="font-heading text-4xl md:text-6xl text-foreground">
              {homePageContent.featuredCarousel.title}
            </h2>
          </div>
          <Link to="/expeditions" className="hidden md:block">
            <span className="font-paragraph text-lg text-foreground hover:text-accent-blue transition-colors flex items-center gap-2">
              {homePageContent.featuredCarousel.viewAllLabel} <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ minHeight: '80vh' }}>
        <AnimatePresence custom={direction} mode="sync">
          <motion.div key={expedition.id} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="absolute inset-0 w-full">
            <div className="group relative w-full overflow-hidden">
              <div className="flex flex-col lg:flex-row w-full min-h-[80vh]">
                <div className="w-full lg:w-3/5 h-[60vh] lg:h-auto relative overflow-hidden">
                  <Link to={`/expeditions/${expedition.id}`} className="block w-full h-full">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                    <Image src={expedition.mainImage} alt={expedition.name} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                  </Link>
                </div>

                <div className="w-full lg:w-2/5 bg-background p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b border-border lg:border-b-0">
                  <motion.div key={`content-${expedition.id}`} custom={direction} variants={contentVariants} initial="enter" animate="center" exit="exit">
                    <div className="flex items-center gap-4 mb-6 text-secondary font-paragraph text-sm tracking-wider uppercase">
                      <span className="flex items-center gap-2"><Map className="w-4 h-4" /> {expedition.destination}</span>
                      <span className="w-px h-4 bg-border" />
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {expedition.durationInDays} Days</span>
                    </div>

                    <Link to={`/expeditions/${expedition.id}`}>
                      <h3 className="font-heading text-3xl md:text-5xl text-foreground mb-6 group-hover:text-accent-blue transition-colors">
                        {expedition.name}
                      </h3>
                    </Link>

                    <p className="font-paragraph text-lg text-secondary leading-relaxed mb-8">{expedition.shortDescription}</p>

                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
                      <div className="flex flex-col">
                        <span className="text-sm text-secondary uppercase tracking-wider">{homePageContent.featuredCarousel.startingFromLabel}</span>
                        <span className="font-heading text-2xl text-foreground">₹{expedition.price}</span>
                      </div>
                      <Link to={`/expeditions/${expedition.id}`}>
                        <button className="w-12 h-12 rounded-full border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>

                    <div className="flex items-center gap-4 mt-10">
                      <button onClick={() => handleManualNav(prev)} aria-label="Previous expedition" className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"><ChevronLeft className="w-5 h-5" /></button>

                      <div className="flex items-center gap-2 flex-1">
                        {featuredExpeditions.map((_, i) => (
                          <button key={i} onClick={() => handleManualNav(() => goTo(i, i > current ? 1 : -1))} aria-label={`Go to expedition ${i + 1}`} className="relative h-px flex-1 bg-border overflow-hidden">
                            {i === current && (
                              <motion.span className="absolute inset-y-0 left-0 bg-foreground" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: AUTO_ADVANCE_INTERVAL / 1000, ease: 'linear' }} key={`progress-${expedition.id}`} />
                            )}
                          </button>
                        ))}
                      </div>

                      <button onClick={() => handleManualNav(next)} aria-label="Next expedition" className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"><ChevronRight className="w-5 h-5" /></button>

                      <span className="font-paragraph text-sm text-secondary tabular-nums ml-1">
                        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center mt-16 md:hidden">
        <Link to="/expeditions">
          <button className="bg-primary text-primary-foreground px-8 py-4 font-paragraph font-medium text-base hover:bg-primary/90 transition-colors inline-flex items-center gap-3">
            {homePageContent.featuredCarousel.mobileViewAllLabel}
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </section>
  );
}
