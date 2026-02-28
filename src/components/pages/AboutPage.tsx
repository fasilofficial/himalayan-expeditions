import { useRef } from 'react';
import { Image } from '@/components/ui/image';
import { useSiteContent } from '@/data/contentStore';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Award, Heart, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

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

export default function AboutPage() {
  const { aboutPageContent } = useSiteContent();
  const valueIconMap = { Shield, Award, Heart, Users };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative w-full h-96 md:h-[500px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage src={aboutPageContent.hero.image} alt={aboutPageContent.hero.imageAlt} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6">{aboutPageContent.hero.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-paragraph text-lg text-white/80 max-w-3xl">{aboutPageContent.hero.description}</motion.p>
        </div>
      </section>

      <section className="w-full max-w-[100rem] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-4xl text-foreground mb-8">{aboutPageContent.story.title}</h2>
            <div className="space-y-6 font-paragraph text-base text-secondary leading-relaxed">
              {aboutPageContent.story.paragraphs.map((paragraph) => (<p key={paragraph}>{paragraph}</p>))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <Image src={aboutPageContent.story.image} alt={aboutPageContent.story.imageAlt} className="w-full h-[600px] object-cover" />
          </motion.div>
        </div>
      </section>

      <section className="w-full bg-background py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <Image src={aboutPageContent.vision.image} alt={aboutPageContent.vision.imageAlt} className="w-full h-[600px] object-cover" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="font-heading text-4xl text-foreground mb-8">{aboutPageContent.vision.title}</h2>
              <div className="space-y-6 font-paragraph text-base text-secondary leading-relaxed">
                {aboutPageContent.vision.paragraphs.map((paragraph) => (<p key={paragraph}>{paragraph}</p>))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="font-heading text-4xl text-foreground mb-8">{aboutPageContent.mission.title}</h2>
              <div className="space-y-6 font-paragraph text-base text-secondary leading-relaxed">
                {aboutPageContent.mission.paragraphs.map((paragraph) => (<p key={paragraph}>{paragraph}</p>))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <Image src={aboutPageContent.mission.image} alt={aboutPageContent.mission.imageAlt} className="w-full h-[600px] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6">{aboutPageContent.values.title}</h2>
            <p className="font-paragraph text-lg text-secondary max-w-3xl mx-auto">{aboutPageContent.values.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {aboutPageContent.values.items.map((item, index) => {
              const Icon = valueIconMap[item.icon as keyof typeof valueIconMap];
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="flex gap-8">
                  <div className="flex-shrink-0"><Icon className="w-12 h-12 text-accent-blue" strokeWidth={1.5} /></div>
                  <div>
                    <h3 className="font-heading text-2xl text-foreground mb-4">{item.title}</h3>
                    <p className="font-paragraph text-base text-secondary leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full max-w-[100rem] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <Image src={aboutPageContent.whyChooseUs.image} alt={aboutPageContent.whyChooseUs.imageAlt} className="w-full h-[600px] object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-4xl text-foreground mb-8">{aboutPageContent.whyChooseUs.title}</h2>
            <div className="space-y-6 font-paragraph text-base text-secondary leading-relaxed">
              {aboutPageContent.whyChooseUs.points.map((point) => (
                <p key={point.label}><strong className="text-foreground">{point.label}</strong> {point.text}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full bg-foreground py-24">
        <div className="max-w-[100rem] mx-auto px-8 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-heading text-4xl md:text-5xl text-primary-foreground mb-6">{aboutPageContent.cta.title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="font-paragraph text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">{aboutPageContent.cta.description}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/expeditions"><button className="bg-primary text-primary-foreground px-8 py-4 font-paragraph font-medium text-base hover:bg-primary/90 transition-colors">{aboutPageContent.cta.primaryLabel}</button></Link>
            <Link to="/contact"><button className="bg-transparent text-primary-foreground border border-primary-foreground px-8 py-4 font-paragraph font-medium text-base hover:bg-primary-foreground hover:text-foreground transition-colors">{aboutPageContent.cta.secondaryLabel}</button></Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
