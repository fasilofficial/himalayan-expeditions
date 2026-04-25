import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSiteContent } from "@/data/contentStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;

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

export default function ContactPage() {
  const { contactPageContent } = useSiteContent();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    expedition: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!FORMSPREE_ENDPOINT) {
      setSubmitError(
        "The contact form is not connected yet. Please add the Formspree endpoint to continue.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          _subject: `New enquiry from ${formData.name || "Website visitor"}`,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          result?.errors?.[0]?.message ||
          "Something went wrong while sending your enquiry. Please try again.";
        throw new Error(message);
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        expedition: "",
        message: "",
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      const fallbackMessage =
        "Something went wrong while sending your enquiry. Please try again.";
      setSubmitError(error instanceof Error ? error.message : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative w-full h-96 md:h-[500px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src={contactPageContent.hero.image}
            alt={contactPageContent.hero.imageAlt}
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
            {contactPageContent.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-paragraph text-lg text-white/80 max-w-3xl"
          >
            {contactPageContent.hero.description}
          </motion.p>
        </div>
      </section>

      <section className="w-full max-w-[100rem] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl text-foreground mb-8">
                {contactPageContent.form.title}
              </h2>

              {submitSuccess && (
                <div className="mb-8 p-6 bg-accent-blue/10 border border-accent-blue">
                  <p className="font-paragraph text-base text-foreground">
                    {contactPageContent.form.success}
                  </p>
                </div>
              )}

              {submitError && (
                <div className="mb-8 p-6 border border-destructive/40 bg-destructive/5">
                  <p className="font-paragraph text-base text-foreground">
                    {submitError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-paragraph text-sm text-foreground mb-3"
                    >
                      {contactPageContent.form.fields.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-foreground/20 font-paragraph text-base text-foreground placeholder:text-secondary/70 focus:outline-none focus:border-accent-blue"
                      placeholder={contactPageContent.form.placeholders.name}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-paragraph text-sm text-foreground mb-3"
                    >
                      {contactPageContent.form.fields.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-foreground/20 font-paragraph text-base text-foreground placeholder:text-secondary/70 focus:outline-none focus:border-accent-blue"
                      placeholder={contactPageContent.form.placeholders.email}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-paragraph text-sm text-foreground mb-3"
                    >
                      {contactPageContent.form.fields.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-foreground/20 font-paragraph text-base text-foreground placeholder:text-secondary/70 focus:outline-none focus:border-accent-blue"
                      placeholder={contactPageContent.form.placeholders.phone}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="expedition"
                      className="block font-paragraph text-sm text-foreground mb-3"
                    >
                      {contactPageContent.form.fields.expedition}
                    </label>
                    <select
                      id="expedition"
                      name="expedition"
                      value={formData.expedition}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-foreground/20 font-paragraph text-base text-foreground focus:outline-none focus:border-accent-blue"
                    >
                      <option value="">
                        {contactPageContent.form.expeditionPlaceholder}
                      </option>
                      {contactPageContent.form.expeditionOptions.map(
                        (option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-paragraph text-sm text-foreground mb-3"
                  >
                    {contactPageContent.form.fields.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-foreground/20 font-paragraph text-base text-foreground placeholder:text-secondary/70 focus:outline-none focus:border-accent-blue resize-none"
                    placeholder={contactPageContent.form.placeholders.message}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-8 py-4 font-paragraph font-medium text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
                >
                  {isSubmitting
                    ? contactPageContent.form.sendingLabel
                    : contactPageContent.form.submitLabel}
                  <Send className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-12"
            >
              <div>
                <h2 className="font-heading text-3xl text-foreground mb-8">
                  {contactPageContent.contactInfo.title}
                </h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <Mail
                        className="w-6 h-6 text-accent-blue"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-foreground mb-2">
                        {contactPageContent.contactInfo.labels.email}
                      </h3>
                      <a
                        href={`mailto:${contactPageContent.contactInfo.email}`}
                        className="font-paragraph text-base text-secondary hover:text-accent-blue transition-colors"
                      >
                        {contactPageContent.contactInfo.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <Phone
                        className="w-6 h-6 text-accent-blue"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-foreground mb-2">
                        {contactPageContent.contactInfo.labels.phone}
                      </h3>
                      <a
                        href={`tel:${contactPageContent.contactInfo.phoneHref}`}
                        className="font-paragraph text-base text-secondary hover:text-accent-blue transition-colors"
                      >
                        {contactPageContent.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <MapPin
                        className="w-6 h-6 text-accent-blue"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-foreground mb-2">
                        {contactPageContent.contactInfo.labels.location}
                      </h3>
                      <p className="font-paragraph text-base text-secondary">
                        {contactPageContent.contactInfo.location[0]}
                        <br />
                        {contactPageContent.contactInfo.location[1]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <MessageSquare
                        className="w-6 h-6 text-accent-blue"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-foreground mb-2">
                        {contactPageContent.contactInfo.labels.whatsapp}
                      </h3>
                      <a
                        href={contactPageContent.contactInfo.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-paragraph text-base text-secondary hover:text-accent-blue transition-colors"
                      >
                        {contactPageContent.contactInfo.whatsappLabel}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-foreground/20 p-8">
                <h3 className="font-heading text-xl text-foreground mb-4">
                  {contactPageContent.quickResponse.title}
                </h3>
                <p className="font-paragraph text-base text-secondary leading-relaxed mb-6">
                  {contactPageContent.quickResponse.description}
                </p>
                <a
                  href={contactPageContent.contactInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="w-full bg-transparent text-accent-blue border border-accent-blue px-6 py-3 font-paragraph font-medium text-base hover:bg-accent-blue hover:text-primary-foreground transition-colors">
                    {contactPageContent.quickResponse.buttonLabel}
                  </button>
                </a>
              </div>

              <div className="border border-foreground/20 p-8">
                <h3 className="font-heading text-xl text-foreground mb-4">
                  {contactPageContent.officeHours.title}
                </h3>
                <div className="space-y-3 font-paragraph text-base text-secondary">
                  {contactPageContent.officeHours.rows.map((row) => (
                    <div key={row.day} className="flex justify-between">
                      <span>{row.day}</span>
                      <span className="text-foreground">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
