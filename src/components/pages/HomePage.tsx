import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Image } from "@/components/ui/image";
import { useSiteContent } from "@/data/contentStore";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass, Mountain, Truck, Users } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import FeaturedExpeditionsCarousel from "../FeaturedExpeditionsCarousel";
import TestimonialsCarousel from "../TestimonialsCarousel";

interface Expedition {
  id: string;
  name: string;
  destination: string;
  price: number;
  durationInDays: number;
  mainImage: string;
  shortDescription: string;
}

interface GalleryItem {
  id: string;
  image: string;
  title: string;
}

const ParallaxImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full">
        <Image src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  );
};

const SectionDivider = () => (
  <div className="w-full flex justify-center py-12 opacity-20">
    <div className="h-24 w-px bg-foreground" />
  </div>
);

export default function HomePage() {
  const { expeditions, galleryItems, homePageContent } = useSiteContent();

  const featuredExpeditions = expeditions
    .filter((expedition) => expedition.isFeatured)
    .slice(0, 5)
    .map((expedition) => ({
      ...expedition,
      id: expedition._id,
    })) as Expedition[];

  const galleryPreview = galleryItems.slice(0, 4).map((item) => ({
    id: item._id,
    image: item.image || "",
    title: item.title || "",
  })) as GalleryItem[];

  const iconMap = { Truck, Users, Mountain };

  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground selection:bg-accent-blue selection:text-white overflow-clip"
    >
      <Header />

      <section className="relative w-full h-screen min-h-[800px] flex flex-col justify-end overflow-hidden">
        {/* <div className="absolute inset-0 z-0">
          <ParallaxImage
            src={homePageContent.hero.heroImage}
            alt={homePageContent.hero.heroImageAlt}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div> */}

        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={homePageContent.hero.heroVideo} type="video/mp4" />
            <img
              src={homePageContent.hero.heroImage}
              alt={homePageContent.hero.heroImageAlt}
              className="w-full h-full object-cover"
            />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 pb-24 md:pb-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-10 lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-block py-2 px-4 mb-6 border border-white/30 text-white/90 font-paragraph text-sm tracking-widest uppercase backdrop-blur-sm">
                  {homePageContent.hero.badge}
                </span>
                <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] tracking-tight mb-8">
                  {homePageContent.hero.title
                    .split(". ")
                    .slice(0, -1)
                    .join(". ")}
                  {". "}
                  <br /> {homePageContent.hero.title.split(". ").slice(-1)}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col md:flex-row gap-8 md:items-end"
              >
                <p className="font-paragraph text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                  {homePageContent.hero.description}
                </p>
                <div className="flex gap-4">
                  <Link to="/expeditions">
                    <button className="group relative px-8 py-4 bg-white text-primary font-paragraph font-medium overflow-hidden transition-all hover:bg-accent-blue hover:text-white">
                      <span className="relative z-10 flex items-center gap-2">
                        {homePageContent.hero.primaryCtaLabel}{" "}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </motion.div>
      </section>

      <section className="relative w-full max-w-[120rem] mx-auto px-6 md:px-12 py-32 md:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
                {homePageContent.philosophy.title
                  .split(" ")
                  .slice(0, -1)
                  .join(" ")}{" "}
                <br /> {homePageContent.philosophy.title.split(" ").slice(-1)}
              </h2>
              <p className="font-paragraph text-lg text-secondary max-w-sm leading-relaxed mb-12">
                {homePageContent.philosophy.description}
              </p>
              <div className="hidden lg:block w-12 h-1 bg-accent-blue" />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-24 md:space-y-32">
            {homePageContent.philosophy.items.map((item, idx) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="group"
                >
                  <div className="flex items-start gap-6 md:gap-10">
                    <div className="shrink-0 p-4 border border-border rounded-full group-hover:border-accent-blue transition-colors duration-500">
                      <Icon
                        className="w-8 h-8 md:w-12 md:h-12 text-accent-blue"
                        strokeWidth={1}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-4 group-hover:text-accent-blue transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="font-paragraph text-base md:text-lg text-secondary leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />
      <FeaturedExpeditionsCarousel featuredExpeditions={featuredExpeditions} />

      <section className="relative w-full max-w-[120rem] mx-auto px-6 md:px-12 py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block mb-6 text-sm tracking-widest uppercase text-accent-blue font-paragraph">
                {homePageContent.impact.eyebrow}
              </span>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
                {homePageContent.impact.title.split(" ").slice(0, -3).join(" ")}{" "}
                <br />{" "}
                {homePageContent.impact.title.split(" ").slice(-3).join(" ")}
              </h2>
              <p className="font-paragraph text-lg text-secondary leading-relaxed mb-8 max-w-xl">
                {homePageContent.impact.description}
              </p>
              <div className="w-16 h-1 bg-accent-blue" />
            </motion.div>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <Image
                src={homePageContent.impact.image}
                alt={homePageContent.impact.imageAlt}
                className="w-full h-[500px] object-cover grayscale"
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>

            <div className="grid grid-cols-3 gap-8 mt-12 text-center">
              {homePageContent.impact.stats.map((item) => (
                <div key={item.label}>
                  <h3 className="font-heading text-3xl md:text-4xl text-foreground">
                    {item.value}
                  </h3>
                  <p className="font-paragraph text-sm text-secondary uppercase tracking-wide">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full max-w-[120rem] mx-auto px-6 md:px-12 py-28 md:py-36">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 md:mb-18">
          <div className="max-w-3xl">
            <span className="inline-block mb-5 text-sm tracking-widest uppercase text-accent-blue font-paragraph">
              {homePageContent.internationalPackages.eyebrow}
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6">
              {homePageContent.internationalPackages.title}
            </h2>
            <p className="font-paragraph text-lg text-secondary leading-relaxed">
              {homePageContent.internationalPackages.description}
            </p>
          </div>
          <div className="hidden lg:block w-20 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {homePageContent.internationalPackages.packages.map((item, index) => (
            <motion.article
              key={item.country}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group h-full overflow-hidden rounded-[1.75rem] border border-border/70 bg-background"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
                <div className="absolute left-0 right-0 bottom-0 p-6">
                  <h3 className="font-heading text-3xl text-white">
                    {item.country}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col p-6 md:p-7 min-h-[220px]">
                <p className="font-paragraph text-base text-secondary leading-relaxed flex-1">
                  {item.description}
                </p>
                <Link to={item.ctaPath} className="mt-8 inline-flex">
                  <button className="group/button inline-flex items-center gap-2 border border-foreground/15 bg-foreground text-background px-5 py-3 font-paragraph text-sm uppercase tracking-[0.18em] transition-colors hover:bg-accent-blue">
                    {homePageContent.internationalPackages.ctaLabel}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </button>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <SectionDivider />

      <TestimonialsCarousel
        eyebrow={homePageContent.testimonials.eyebrow}
        title={homePageContent.testimonials.title}
        description={homePageContent.testimonials.description}
        testimonials={homePageContent.testimonials.items}
      />

      <section className="w-full max-w-[120rem] mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
              {homePageContent.gallery.title}
            </h2>
            <p className="font-paragraph text-lg text-secondary">
              {homePageContent.gallery.description}
            </p>
          </div>
          <Link to="/gallery" className="hidden md:block">
            <button className="px-8 py-3 border border-border text-foreground font-paragraph hover:bg-foreground hover:text-background transition-colors">
              {homePageContent.gallery.openGalleryLabel}
            </button>
          </Link>
        </div>

        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-4 snap-x snap-mandatory px-1">
            {galleryPreview.map((item) => (
              <div
                key={item.id}
                className="min-w-[75%] snap-center relative group overflow-hidden"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-secondary/10 rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <span className="text-white font-heading text-lg">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {galleryPreview.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative group overflow-hidden ${index % 2 === 0 ? "lg:mt-12" : ""}`}
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-secondary/10">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-white font-heading text-lg">
                    {item.title}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link to="/gallery">
            <button className="px-8 py-3 border border-border text-foreground font-paragraph hover:bg-foreground hover:text-background transition-colors">
              {homePageContent.gallery.openGalleryLabel}
            </button>
          </Link>
        </div>
      </section>

      <section className="relative w-full py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={homePageContent.cta.background}
            alt={homePageContent.cta.backgroundAlt}
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Compass
              className="w-16 h-16 text-accent-blue mx-auto mb-8"
              strokeWidth={1}
            />
            <h2 className="font-heading text-5xl md:text-7xl text-foreground mb-8">
              {homePageContent.cta.title}
            </h2>
            <p className="font-paragraph text-xl text-secondary mb-12 max-w-2xl mx-auto">
              {homePageContent.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/contact">
                <button className="w-full sm:w-auto px-10 py-5 bg-foreground text-background font-paragraph font-medium text-lg hover:bg-accent-blue transition-colors">
                  {homePageContent.cta.primaryLabel}
                </button>
              </Link>
              <Link to="/expeditions">
                <button className="w-full sm:w-auto px-10 py-5 border border-foreground text-foreground font-paragraph font-medium text-lg hover:bg-foreground hover:text-background transition-colors">
                  {homePageContent.cta.secondaryLabel}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
