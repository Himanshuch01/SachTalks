import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Videos", href: "/videos" },
    { name: "Blogs", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container-wide mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/sachtalks.jpg"
              alt="SACH TALKS logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-sm shadow-md group-hover:shadow-glow transition-shadow duration-300 object-contain bg-white"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground text-xl md:text-2xl tracking-tight">
                SACH TALKS
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">
                Truth First
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all ${
                  isActive(link.href)
                    ? "text-primary after:w-full"
                    : "text-foreground/80 hover:text-primary after:w-0 hover:after:w-full"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.youtube.com/@SachTalksOfficial"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="default" className="gap-2">
                <Youtube className="w-4 h-4" />
                Subscribe
              </Button>
            </a>
            {/* <Link to="/admin">
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
        {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-up">
          <nav className="container-wide mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium py-2 transition-colors ${
                  isActive(link.href) ? "text-primary" : "text-foreground hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <a
                href="https://www.youtube.com/@SachTalksOfficial"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" className="w-full gap-2">
                  <Youtube className="w-4 h-4" />
                  Subscribe on YouTube
                </Button>
              </a>
              <Link to="/admin">
                {/* <Button variant="outline" className="w-full">
                  Admin Panel
                </Button> */}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
