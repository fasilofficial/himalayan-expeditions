import { Image } from '@/components/ui/image';
import { useSiteContent } from '@/data/contentStore';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { headerContent } = useSiteContent();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = headerContent.navLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
      <div className="max-w-[100rem] mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <Image
              src={headerContent.logo.src}
              alt={headerContent.logo.alt}
              width={60}
              height={60}
              className="object-contain"
            />
            <span className="font-heading text-lg md:text-xl text-foreground">
              {headerContent.logo.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph transition-colors ${
                  isActive(link.path)
                    ? 'text-accent-blue'
                    : 'text-foreground hover:text-accent-blue'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link to={headerContent.cta.path} className="hidden md:block">
            <button className="bg-primary text-primary-foreground px-6 py-3 text-sm hover:bg-primary/90 transition-colors">
              {headerContent.cta.label}
            </button>
          </Link>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-t border-foreground/10">
          <div className="flex flex-col px-6 py-6 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-paragraph text-lg ${
                  isActive(link.path) ? 'text-accent-blue' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link to={headerContent.cta.path} onClick={() => setIsOpen(false)}>
              <button className="w-full bg-primary text-primary-foreground py-3 mt-4">
                {headerContent.cta.label}
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
