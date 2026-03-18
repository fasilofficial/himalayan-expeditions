import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Image } from "@/components/ui/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSiteContent } from "@/data/contentStore";
import { Expeditions } from "@/entities";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  MapPin,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ExpeditionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { expeditions, expeditionDetailPageContent } = useSiteContent();
  const [expedition, setExpedition] = useState<Expeditions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const data = expeditions.find((item) => item._id === id) || null;
    setExpedition((data as Expeditions) || null);
    setIsLoading(false);
  }, [id, expeditions]);

  const parseListItems = (text?: string): string[] => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim());
  };

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

  const heroImages = useMemo(() => {
    if (!expedition) return [];

    const mainImage =
      normalizeImageUrl(expedition.mainImage) ||
      normalizeImageUrl(expeditionDetailPageContent.heroFallbackImage);

    const additionalImages =
      expedition.images
        ?.map((image) => normalizeImageUrl(image))
        .filter((image): image is string => Boolean(image)) || [];

    return [mainImage, ...additionalImages].filter(
      (image, index, images): image is string =>
        Boolean(image) && images.indexOf(image) === index,
    );
  }, [expedition, expeditionDetailPageContent.heroFallbackImage]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [heroImages]);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % heroImages.length);
    }, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [heroImages]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 min-h-[600px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <LoadingSpinner />
          </div>
        ) : !expedition ? (
          <div className="max-w-[100rem] mx-auto px-8 py-32 text-center">
            <h2 className="font-heading text-3xl text-foreground mb-6">
              {expeditionDetailPageContent.notFoundTitle}
            </h2>
            <p className="font-paragraph text-base text-secondary mb-8">
              {expeditionDetailPageContent.notFoundDescription}
            </p>
            <Link to="/expeditions">
              <button className="bg-primary text-primary-foreground px-8 py-4 font-paragraph font-medium text-base hover:bg-primary/90 transition-colors">
                {expeditionDetailPageContent.notFoundCtaLabel}
              </button>
            </Link>
          </div>
        ) : (
          <>
            <section className="relative w-full h-[70vh] min-h-[500px]">
              {heroImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === activeImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ willChange: "opacity" }}
                >
                  <Image
                    src={image}
                    alt={expedition.name || "Expedition"}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0">
                <div className="max-w-[100rem] mx-auto px-8 pb-16">
                  <Link
                    to="/expeditions"
                    className="inline-flex items-center gap-2 font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground mb-8 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                    {expeditionDetailPageContent.backToExpeditionsLabel}
                  </Link>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6"
                  >
                    {expedition.name}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-wrap items-center gap-8 font-paragraph text-base text-primary-foreground/90"
                  >
                    {expedition.destination && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" strokeWidth={1.5} />
                        <span>{expedition.destination}</span>
                      </div>
                    )}
                    {expedition.durationInDays && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" strokeWidth={1.5} />
                        <span>{expedition.durationInDays} Days</span>
                      </div>
                    )}
                    {expedition.difficulty && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
                        <span>{expedition.difficulty}</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="w-full max-w-[100rem] mx-auto px-8 py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-16">
                  {expedition.shortDescription && (
                    <div>
                      <h2 className="font-heading text-3xl text-foreground mb-6">
                        {expeditionDetailPageContent.overviewTitle}
                      </h2>
                      {expedition.shortDescription
                        .split("\n")
                        .map((line, i) => (
                          <p
                            key={i}
                            className="mt-4 font-paragraph text-lg text-secondary leading-relaxed"
                          >
                            {line}
                          </p>
                        ))}
                    </div>
                  )}

                  {expedition.highlights && (
                    <div>
                      <h2 className="font-heading text-3xl text-foreground mb-6">
                        {expeditionDetailPageContent.highlightsTitle}
                      </h2>
                      <div className="space-y-4">
                        {parseListItems(expedition.highlights).map(
                          (highlight, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <CheckCircle2
                                className="w-6 h-6 text-accent-blue flex-shrink-0 mt-1"
                                strokeWidth={1.5}
                              />
                              <p className="font-paragraph text-base text-secondary leading-relaxed">
                                {highlight}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {expedition.itinerary && (
                    <div>
                      <h2 className="font-heading text-3xl text-foreground mb-6">
                        {expeditionDetailPageContent.itineraryTitle}
                      </h2>
                      <div className="space-y-6">
                        {parseListItems(expedition.itinerary).map(
                          (day, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-accent-blue pl-8 py-2"
                            >
                              <h3 className="font-heading text-xl text-foreground mb-2">
                                {expeditionDetailPageContent.dayLabelPrefix}{" "}
                                {index + 1}
                              </h3>
                              <p className="font-paragraph text-base text-secondary leading-relaxed">
                                {day}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {expedition.whatsIncluded && (
                    <div>
                      <h2 className="font-heading text-3xl text-foreground mb-6">
                        {expeditionDetailPageContent.whatsIncludedTitle}
                      </h2>
                      <div className="space-y-4">
                        {parseListItems(expedition.whatsIncluded).map(
                          (item, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <CheckCircle2
                                className="w-6 h-6 text-accent-blue flex-shrink-0 mt-1"
                                strokeWidth={1.5}
                              />
                              <p className="font-paragraph text-base text-secondary leading-relaxed">
                                {item}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {expedition.whatsNotIncluded && (
                    <div>
                      <h2 className="font-heading text-3xl text-foreground mb-6">
                        {expeditionDetailPageContent.whatsNotIncludedTitle}
                      </h2>
                      <div className="space-y-4">
                        {parseListItems(expedition.whatsNotIncluded).map(
                          (item, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <XCircle
                                className="w-6 h-6 text-secondary flex-shrink-0 mt-1"
                                strokeWidth={1.5}
                              />
                              <p className="font-paragraph text-base text-secondary leading-relaxed">
                                {item}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4">
                  <div className="sticky top-32 space-y-8">
                    <div className="border border-foreground/20 p-8">
                      <div className="mb-8">
                        <p className="font-paragraph text-sm text-secondary mb-2">
                          {expeditionDetailPageContent.priceLabel}
                        </p>
                        <p className="font-heading text-4xl text-foreground">
                          ${expedition.price}
                        </p>
                        <p className="font-paragraph text-sm text-secondary mt-2">
                          {expeditionDetailPageContent.perPersonLabel}
                        </p>
                      </div>

                      <Link to="/contact" className="block">
                        <button className="w-full bg-primary text-primary-foreground px-8 py-4 font-paragraph font-medium text-base hover:bg-primary/90 transition-colors mb-4">
                          {expeditionDetailPageContent.enquireLabel}
                        </button>
                      </Link>

                      <a
                        href={expeditionDetailPageContent.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <button className="w-full bg-transparent text-accent-blue border border-accent-blue px-8 py-4 font-paragraph font-medium text-base hover:bg-accent-blue hover:text-primary-foreground transition-colors">
                          {expeditionDetailPageContent.whatsappLabel}
                        </button>
                      </a>
                    </div>

                    <div className="border border-foreground/20 p-8 space-y-6">
                      <h3 className="font-heading text-xl text-foreground mb-6">
                        {expeditionDetailPageContent.quickInfoTitle}
                      </h3>

                      {expedition.durationInDays && (
                        <div>
                          <p className="font-paragraph text-sm text-secondary mb-2">
                            {expeditionDetailPageContent.durationLabel}
                          </p>
                          <p className="font-paragraph text-base text-foreground">
                            {expedition.durationInDays} Days
                          </p>
                        </div>
                      )}

                      {expedition.difficulty && (
                        <div>
                          <p className="font-paragraph text-sm text-secondary mb-2">
                            {expeditionDetailPageContent.difficultyLabel}
                          </p>
                          <p className="font-paragraph text-base text-foreground">
                            {expedition.difficulty}
                          </p>
                        </div>
                      )}

                      {expedition.destination && (
                        <div>
                          <p className="font-paragraph text-sm text-secondary mb-2">
                            {expeditionDetailPageContent.destinationLabel}
                          </p>
                          <p className="font-paragraph text-base text-foreground">
                            {expedition.destination}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
