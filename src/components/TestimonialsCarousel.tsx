import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_ADVANCE_INTERVAL = 6000;

type Testimonial = {
  name: string;
  location?: string;
  stars: number;
  reviewTitle: string;
  description: string;
};

type TestimonialsCarouselProps = {
  eyebrow: string;
  title: string;
  description: string;
  testimonials: Testimonial[];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

export default function TestimonialsCarousel({
  eyebrow,
  title,
  description,
  testimonials,
}: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;

  const goTo = useCallback(
    (index: number, dir: number) => {
      if (!total) return;
      setDirection(dir);
      setCurrent((index + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (total <= 1) return;

    timerRef.current = setInterval(next, AUTO_ADVANCE_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [next, total]);

  const handleManualNav = (fn: () => void) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    fn();

    if (total > 1) {
      timerRef.current = setInterval(next, AUTO_ADVANCE_INTERVAL);
    }
  };

  if (!total) return null;

  const testimonial = testimonials[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
    }),
  };

  return (
    <section className="relative w-full max-w-[120rem] mx-auto px-6 md:px-12 py-16 md:py-20">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 md:mb-10">
        <div className="max-w-3xl">
          <span className="inline-block mb-3 text-xs tracking-[0.22em] uppercase text-accent-blue font-paragraph">
            {eyebrow}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
            {title}
          </h2>
          <p className="font-paragraph text-base md:text-lg text-secondary leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleManualNav(prev)}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleManualNav(next)}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-background min-h-[14rem]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.article
            key={`${testimonial.name}-${current}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="p-5 md:p-6 lg:p-7"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-accent-blue/12 border border-accent-blue/20 flex items-center justify-center shrink-0">
                  <span className="font-heading text-lg text-accent-blue">
                    {getInitials(testimonial.name)}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-xl md:text-2xl text-foreground uppercase tracking-tight">
                        {testimonial.name}
                        {testimonial.location
                          ? ` (${testimonial.location})`
                          : ""}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < testimonial.stars
                                ? "fill-[#F59E0B] text-[#F59E0B]"
                                : "text-border"
                            }`}
                            strokeWidth={1.6}
                          />
                        ))}
                      </div>
                      <p className="font-paragraph text-base text-secondary mt-2">
                        ({testimonial.stars}/5) Rating
                      </p>
                    </div>

                    <Quote
                      className="hidden lg:block w-8 h-8 text-accent-blue/40"
                      strokeWidth={1.4}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-heading text-2xl md:text-3xl text-foreground leading-tight mb-3">
                  {testimonial.reviewTitle}
                </h4>
                <p className="font-paragraph text-base md:text-lg text-secondary leading-relaxed max-w-4xl">
                  {testimonial.description}
                </p>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center gap-2 mt-8 max-w-5xl mx-auto">
          {testimonials.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              onClick={() =>
                handleManualNav(() => goTo(index, index > current ? 1 : -1))
              }
              aria-label={`Go to testimonial ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-10 bg-foreground"
                  : "w-2 bg-border hover:bg-secondary"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
