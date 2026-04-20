import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Image } from "@/components/ui/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSiteContent } from "@/data/contentStore";
import { Expeditions } from "@/entities";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BedSingle,
  Calendar,
  CheckCircle2,
  Clock3,
  ChevronDown,
  MapPin,
  TrendingUp,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type ItineraryMetaLabel = "Accommodation" | "Meals" | "Treks Duration";

type ItineraryParsedBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "meta"; label: ItineraryMetaLabel; value: string }
  | { type: "labelledText"; label: string; value: string };

type ItineraryRenderBlock =
  | Exclude<ItineraryParsedBlock, { type: "meta" }>
  | {
      type: "metaGroup";
      items: Array<{ label: ItineraryMetaLabel; value: string }>;
    };

const KNOWN_ITINERARY_META_LABELS = [
  "Accommodation",
  "Meals",
  "Treks Duration",
] as const;

const ITINERARY_META_ICON_MAP = {
  Accommodation: BedSingle,
  Meals: UtensilsCrossed,
  "Treks Duration": Clock3,
} as const;

const normalizeItineraryText = (text: string) =>
  text.replace(/\r\n?/g, "\n").replace(/\/n/g, "\n");

const getKnownMetaLabel = (label: string): ItineraryMetaLabel | null => {
  const normalizedLabel = label.trim().replace(/:$/, "").toLowerCase();

  const matchedLabel = KNOWN_ITINERARY_META_LABELS.find(
    (knownLabel) => knownLabel.toLowerCase() === normalizedLabel,
  );

  return matchedLabel || null;
};

const isNumberedSubheading = (text: string) => /^\d+\)\s*\S+/.test(text.trim());

const isStandaloneSubheading = (text: string) => {
  const trimmedText = text.trim();

  if (!trimmedText) return false;
  if (isNumberedSubheading(trimmedText)) return true;

  return trimmedText.endsWith(":") && !getKnownMetaLabel(trimmedText);
};

const parseItineraryDescription = (description: string): ItineraryRenderBlock[] => {
  const normalizedDescription = normalizeItineraryText(description);
  const rawBlocks = normalizedDescription
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  const parsedBlocks: ItineraryParsedBlock[] = rawBlocks.map((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return { type: "paragraph", text: block };
    }

    const [firstLine, ...remainingLines] = lines;
    const inlineLabelMatch = firstLine.match(/^([^:]+):\s*(.+)$/);

    if (inlineLabelMatch) {
      const label = inlineLabelMatch[1].trim();
      const value = inlineLabelMatch[2].trim();
      const knownMetaLabel = getKnownMetaLabel(label);

      if (knownMetaLabel) {
        return { type: "meta", label: knownMetaLabel, value };
      }

      return { type: "labelledText", label, value };
    }

    const knownMetaLabel = getKnownMetaLabel(firstLine);

    if (knownMetaLabel && remainingLines.length > 0) {
      return {
        type: "meta",
        label: knownMetaLabel,
        value: remainingLines.join(" ").trim(),
      };
    }

    if (firstLine.endsWith(":") && remainingLines.length > 0) {
      return {
        type: "labelledText",
        label: firstLine.replace(/:$/, "").trim(),
        value: remainingLines.join(" ").trim(),
      };
    }

    if (lines.length === 1 && isStandaloneSubheading(firstLine)) {
      return { type: "subheading", text: firstLine };
    }

    return {
      type: "paragraph",
      text: lines.join(" ").trim(),
    };
  });

  return parsedBlocks.reduce<ItineraryRenderBlock[]>((blocks, block) => {
    if (block.type !== "meta") {
      blocks.push(block);
      return blocks;
    }

    const previousBlock = blocks[blocks.length - 1];

    if (previousBlock?.type === "metaGroup") {
      previousBlock.items.push({ label: block.label, value: block.value });
      return blocks;
    }

    blocks.push({
      type: "metaGroup",
      items: [{ label: block.label, value: block.value }],
    });

    return blocks;
  }, []);
};

export default function ExpeditionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { expeditions, expeditionDetailPageContent } = useSiteContent();
  const [expedition, setExpedition] = useState<Expeditions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedItineraryIndex, setExpandedItineraryIndex] = useState<
    number | null
  >(null);

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

  const itineraryItems = useMemo(() => {
    if (!expedition) return [];

    if (expedition.itineraryItems?.length) {
      return expedition.itineraryItems
        .filter((item) => item?.title?.trim())
        .map((item) => ({
          title: item.title.trim(),
          description: item.description?.trim() || "",
        }));
    }

    return parseListItems(expedition.itinerary).map((item) => ({
      title: item,
      description: "",
    }));
  }, [expedition]);

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
    setExpandedItineraryIndex(null);
  }, [expedition?._id]);

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

                  {itineraryItems.length > 0 && (
                    <div>
                      <h2 className="font-heading text-3xl text-foreground mb-6">
                        {expeditionDetailPageContent.itineraryTitle}
                      </h2>
                      <div className="space-y-6">
                        {itineraryItems.map((item, index) => {
                          const hasDescription = Boolean(item.description);
                          const isExpanded = expandedItineraryIndex === index;

                          return (
                            <div
                              key={index}
                              className="border-l-2 border-accent-blue pl-8 py-2"
                            >
                              <h3 className="font-heading text-xl text-foreground mb-2">
                                {expeditionDetailPageContent.dayLabelPrefix}{" "}
                                {index + 1}
                              </h3>
                              {hasDescription ? (
                                <div className="rounded-2xl border border-foreground/10 bg-background/80 transition-colors">
                                  <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                    aria-expanded={isExpanded}
                                    onClick={() =>
                                      setExpandedItineraryIndex((current) =>
                                        current === index ? null : index,
                                      )
                                    }
                                  >
                                    <span className="font-paragraph text-base text-secondary leading-relaxed">
                                      {item.title}
                                    </span>
                                    <ChevronDown
                                      className={`h-5 w-5 flex-shrink-0 text-secondary transition-transform duration-200 ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                      strokeWidth={1.5}
                                    />
                                  </button>

                                  {isExpanded && (
                                    <div className="border-t border-foreground/10 px-5 py-5">
                                      <div className="space-y-6">
                                        {parseItineraryDescription(
                                          item.description,
                                        ).map((block, blockIndex) => {
                                          if (block.type === "paragraph") {
                                            return (
                                              <p
                                                key={blockIndex}
                                                className="font-paragraph text-base text-secondary leading-relaxed"
                                              >
                                                {block.text}
                                              </p>
                                            );
                                          }

                                          if (block.type === "subheading") {
                                            return (
                                              <h4
                                                key={blockIndex}
                                                className="font-heading text-2xl text-foreground"
                                              >
                                                {block.text}
                                              </h4>
                                            );
                                          }

                                          if (block.type === "labelledText") {
                                            return (
                                              <div key={blockIndex} className="space-y-2">
                                                <h4 className="font-heading text-2xl text-foreground">
                                                  {block.label}:
                                                </h4>
                                                <p className="font-paragraph text-base text-secondary leading-relaxed">
                                                  {block.value}
                                                </p>
                                              </div>
                                            );
                                          }

                                          return (
                                            <div
                                              key={blockIndex}
                                              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                                            >
                                              {block.items.map((metaItem) => {
                                                const Icon =
                                                  ITINERARY_META_ICON_MAP[
                                                    metaItem.label
                                                  ];

                                                return (
                                                  <div
                                                    key={`${metaItem.label}-${metaItem.value}`}
                                                    className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-muted/30 px-4 py-4"
                                                  >
                                                    <Icon
                                                      className="mt-1 h-8 w-8 flex-shrink-0 text-accent-blue"
                                                      strokeWidth={1.8}
                                                    />
                                                    <div>
                                                      <p className="font-heading text-xl text-foreground">
                                                        {metaItem.label}
                                                      </p>
                                                      <p className="font-paragraph text-base text-secondary leading-relaxed">
                                                        {metaItem.value}
                                                      </p>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="font-paragraph text-base text-secondary leading-relaxed">
                                  {item.title}
                                </p>
                              )}
                            </div>
                          );
                        })}
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
                          £{expedition.price}
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
