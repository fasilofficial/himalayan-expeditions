import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Image } from "@/components/ui/image";
import { useSiteContent } from "@/data/contentStore";
import { Expeditions } from "@/entities";
import { motion, useScroll, useTransform } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

const ExpeditionCardImageCarousel = ({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [images]);

  return (
    <div className="mb-6 overflow-hidden relative h-80">
      {images.map((image, imageIndex) => (
        <div
          key={`${image}-${imageIndex}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            imageIndex === activeImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ willChange: "opacity" }}
        >
          <Image
            src={image}
            alt={alt}
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ willChange: "transform" }}
          />
        </div>
      ))}
    </div>
  );
};

export default function ExpeditionsPage() {
  const { expeditions: expeditionsContent, expeditionsPageContent } =
    useSiteContent();
  const [expeditions, setExpeditions] = useState<Expeditions[]>([]);
  const [filteredExpeditions, setFilteredExpeditions] = useState<Expeditions[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    loadExpeditions();
  }, [expeditionsContent]);

  useEffect(() => {
    filterExpeditions();
  }, [
    expeditions,
    searchTerm,
    selectedDifficulty,
    selectedDestination,
    priceRange,
  ]);

  const normalizeImageUrl = (image?: string): string | null => {
    if (!image?.trim()) return null;

    if (
      image.startsWith("/") ||
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    return `/${image.replace(/^\/+/, "")}`;
  };

  const getCardImages = (expedition: Expeditions): string[] => {
    const mainImage =
      normalizeImageUrl(expedition.mainImage) ||
      normalizeImageUrl(expeditionsPageContent.cardFallbackImage);

    const additionalImages =
      expedition.images
        ?.map((image) => normalizeImageUrl(image))
        .filter((image): image is string => Boolean(image)) || [];

    return [mainImage, ...additionalImages].filter(
      (image, index, images): image is string =>
        Boolean(image) && images.indexOf(image) === index,
    );
  };

  const loadExpeditions = async () => {
    setIsLoading(true);
    setExpeditions(expeditionsContent as Expeditions[]);
    setIsLoading(false);
  };

  const filterExpeditions = () => {
    let filtered = [...expeditions];

    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.shortDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (exp) => exp.difficulty === selectedDifficulty,
      );
    }

    if (selectedDestination !== "all") {
      filtered = filtered.filter(
        (exp) => exp.destination === selectedDestination,
      );
    }

    if (priceRange !== "all") {
      filtered = filtered.filter((exp) => {
        const price = exp.price || 0;
        switch (priceRange) {
          case "budget":
            return price < 1000;
          case "mid":
            return price >= 1000 && price < 2000;
          case "premium":
            return price >= 2000;
          default:
            return true;
        }
      });
    }

    setFilteredExpeditions(filtered);
  };

  Array.from(
    new Set(expeditions.map((exp) => exp.destination).filter(Boolean)),
  );
  Array.from(new Set(expeditions.map((exp) => exp.difficulty).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative w-full h-96 md:h-[500px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src={expeditionsPageContent.hero.image}
            alt={expeditionsPageContent.hero.imageAlt}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6"
          >
            {expeditionsPageContent.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-paragraph text-lg text-white/80 max-w-3xl"
          >
            {expeditionsPageContent.hero.description}
          </motion.p>
        </div>
      </section>

      <section className="w-full max-w-[100rem] mx-auto px-8 py-24">
        <div className="min-h-[600px]">
          {isLoading ? null : filteredExpeditions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredExpeditions.map((expedition, index) => (
                <motion.div
                  key={expedition._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {(() => {
                    const cardImages = getCardImages(expedition);

                    return (
                      <Link
                        to={`/expeditions/${expedition._id}`}
                        className="group block"
                      >
                        <ExpeditionCardImageCarousel
                          images={cardImages}
                          alt={expedition.name || "Expedition"}
                        />

                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-heading text-2xl text-foreground group-hover:text-accent-blue transition-colors">
                              {expedition.name}
                            </h3>
                            {expedition.price && (
                              <span className="font-paragraph text-xl text-foreground font-medium whitespace-nowrap">
                                £{expedition.price}
                              </span>
                            )}
                          </div>

                          {expedition.shortDescription && (
                            <p className="font-paragraph text-base text-secondary leading-relaxed line-clamp-2">
                              {expedition.shortDescription}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 font-paragraph text-sm text-secondary">
                            {expedition.destination && (
                              <span>{expedition.destination}</span>
                            )}
                            {expedition.destination &&
                              expedition.durationInDays && <span>•</span>}
                            {expedition.durationInDays && (
                              <span>{expedition.durationInDays} Days</span>
                            )}
                            {expedition.durationInDays &&
                              expedition.difficulty && <span>•</span>}
                            {expedition.difficulty && (
                              <span>{expedition.difficulty}</span>
                            )}
                          </div>

                          {expedition.isFeatured && (
                            <div className="inline-block">
                              <span className="font-paragraph text-xs text-accent-blue border border-accent-blue px-3 py-1">
                                FEATURED
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <SlidersHorizontal
                className="w-16 h-16 text-secondary/40 mx-auto mb-6"
                strokeWidth={1.5}
              />
              <h3 className="font-heading text-2xl text-foreground mb-4">
                {expeditionsPageContent.emptyState.title}
              </h3>
              <p className="font-paragraph text-base text-secondary">
                {expeditionsPageContent.emptyState.description}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
