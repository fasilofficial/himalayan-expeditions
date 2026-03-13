import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Twitter } from 'lucide-react';
import { useSiteContent } from '@/data/contentStore';
import { Link } from 'react-router-dom';
import { Image } from './ui/image';

export default function Footer() {
  const { expeditions, footerContent, headerContent } = useSiteContent();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-[100rem] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16 gap-x-16 gap-y-10">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <Image
                src={headerContent.logo.src}
                alt={headerContent.logo.alt}
                width={64}
                height={64}
                className="object-contain"
              />
              <span className="font-heading text-xl">{footerContent.brandName}</span>
            </Link>
            <p className="font-paragraph text-base text-primary-foreground/80 leading-relaxed mb-8">
              {footerContent.brandDescription}
            </p>
            <div className="flex items-center gap-6">
              <a href={footerContent.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent-blue transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" strokeWidth={1.5} /></a>
              <a href={footerContent.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent-blue transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" strokeWidth={1.5} /></a>
              <a href={footerContent.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent-blue transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" strokeWidth={1.5} /></a>
              <a href={footerContent.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent-blue transition-colors" aria-label="WhatsApp"><MessageCircle className="w-5 h-5" strokeWidth={1.5} /></a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-heading text-lg text-primary-foreground mb-8">Quick Links</h3>
            <nav className="flex flex-col gap-4">
              {footerContent.quickLinks.map((link) => (
                <Link key={link.path} to={link.path} className="font-paragraph text-base text-primary-foreground/80 hover:text-accent-blue transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-heading text-lg text-primary-foreground mb-8">Popular Expeditions</h3>
            <nav className="flex flex-col gap-4">
              {expeditions.slice(0, 4).map((expedition) => (
                <Link key={expedition._id} to={`/expeditions/${expedition._id}`} className="font-paragraph text-base text-primary-foreground/80 hover:text-accent-blue transition-colors">
                  {expedition.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-heading text-lg text-primary-foreground mb-8">Contact</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent-blue flex-shrink-0 mt-1" strokeWidth={1.5} />
                <a href={`mailto:${footerContent.contact.email}`} className="font-paragraph text-base text-primary-foreground/80 hover:text-accent-blue transition-colors">{footerContent.contact.email}</a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent-blue flex-shrink-0 mt-1" strokeWidth={1.5} />
                <a href={`tel:${footerContent.contact.phoneHref}`} className="font-paragraph text-base text-primary-foreground/80 hover:text-accent-blue transition-colors">{footerContent.contact.phone}</a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-blue flex-shrink-0 mt-1" strokeWidth={1.5} />
                <span className="font-paragraph text-base text-primary-foreground/80">{footerContent.contact.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} {footerContent.brandName}. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              {footerContent.legalLinks.map((link) => (
                <Link key={link.label} to={link.path} className="font-paragraph text-sm text-primary-foreground/60 hover:text-accent-blue transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
